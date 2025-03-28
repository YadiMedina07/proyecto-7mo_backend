import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Crear un nuevo producto con imágenes subidas a Cloudinary*/
export const crearProducto = async (req, res) => {
  try {
    const { 
      name,
      description,
      precio, 
      sabor, 
      tamano,
      stock       // ← nuevo campo
    } = req.body;

    //  Manejo de imágenes (Cloudinary)
    let imagesURLs = [];
    if (req.files && req.files.length > 0) {
      imagesURLs = req.files.map((file) => file.path);
    }

    //  Crear el producto
    const newProduct = await prisma.Productos.create({
      data: {
        name,
        description: description || "",
        precio: precio ? Number(precio) : 0,
        sabor,
        tamano: tamano ? Number(tamano) : 0,
        stock: stock ? Number(stock) : 0,
        imagenes: imagesURLs.length
          ? { create: imagesURLs.map((imageUrl) => ({ imageUrl })) }
          : undefined,
      },
      include: {
        imagenes: true,
      },
    });

    return res.status(201).json({
      message: "Producto creado exitosamente",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error al crear el producto:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};


/**
 * Actualizar un producto (incluyendo subida de imágenes a Cloudinary)
 */
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);

    // Extraer campos del body
    const { name, description, precio, sabor, tamano, stock } = req.body;

    // req.files: nuevas imágenes subidas
    let newImagesURLs = [];
    if (req.files && req.files.length > 0) {
      newImagesURLs = req.files.map((file) => file.path);
    }

    // 1. Actualizar los campos básicos del producto
    const updatedProduct = await prisma.Productos.update({
      where: { id: numericId },
      data: {
        name,
        description,
        // Convertir a número si se proporciona
        precio: precio ? Number(precio) : undefined,
        sabor,
        // Usamos el campo "tamaño" del modelo a partir del valor "tamano" enviado
        tamano: tamano ? Number(tamano) : undefined,
        stock: stock !== undefined ? Number(stock) : undefined,
      },
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    // 2. Manejo de imágenes
    // Si se indica en el body que se deben remover las imágenes anteriores
    if (req.body.removeOldImages && req.body.removeOldImages === "true") {
      await prisma.ImagenesProductos.deleteMany({ where: { productoId: numericId } });
    }

    // Crear nuevas imágenes si existen
    if (newImagesURLs.length > 0) {
      await prisma.ImagenesProductos.createMany({
        data: newImagesURLs.map((url) => ({
          imageUrl: url,
          productoId: numericId,
        })),
      });
    }

    // 3. Retornar el producto con sus relaciones actualizadas
    const productWithRelations = await prisma.Productos.findUnique({
      where: { id: numericId },
      include: { imagenes: true },
    });

    res.status(200).json({
      message: "Producto actualizado exitosamente",
      product: productWithRelations,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Producto no encontrado." });
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
};





export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);

    // Verificar si existe el producto
    const existingProduct = await prisma.Productos.findUnique({
      where: { id: numericId },
    });
    if (!existingProduct) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    // Eliminar las imágenes asociadas al producto
    await prisma.ImagenesProductos.deleteMany({ where: { productoId: numericId } });

    // Eliminar el producto
    await prisma.Productos.delete({ where: { id: numericId } });

    res.status(200).json({ message: "Producto eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


/**
 * Obtener un producto por ID
 */
export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);

    const producto = await prisma.productos.findUnique({
      where: { id: numericId },
      include: {
        images: true,
        compatibilities: true,
        supplier: true,
      },
    });

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    res.status(200).json(producto);
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const obtenerProductosAdmin = async (req, res) => {
  try {
    // Obtener todos los productos sin paginación
    const productos = await prisma.Productos.findMany({
      include: {
        imagenes: true,
        reviews: true, // Si no necesitas las reviews, puedes quitar esta línea
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ productos });
  } catch (error) {
    console.error("Error al obtener productos para administración:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const agregarProductoCarrito = async (req, res) => {
  try {
    // Verifica que el usuario esté autenticado
    if (!req.userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }
    const usuarioId = req.userId;
    const { productId, cantidad } = req.body;
    const qty = cantidad ? Number(cantidad) : 1;

    // Verificar que el producto exista
    const producto = await prisma.Productos.findUnique({
      where: { id: Number(productId) },
    });
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Revisar si el producto ya está en el carrito del usuario
    const carritoExistente = await prisma.Carrito.findFirst({
      where: {
        usuarioId,
        productoId: Number(productId),
      },
    });

    let carritoItem;
    if (carritoExistente) {
      // Incrementar la cantidad existente
      carritoItem = await prisma.Carrito.update({
        where: { id: carritoExistente.id },
        data: { cantidad: carritoExistente.cantidad + qty },
      });
    } else {
      // Crear una nueva entrada en el carrito
      carritoItem = await prisma.Carrito.create({
        data: {
          usuarioId,
          productoId: Number(productId),
          cantidad: qty,
        },
      });
    }

    return res.status(200).json({ message: "Producto agregado al carrito", carritoItem });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const obtenerCarrito = async (req, res) => {
  try {
    // Se asume que el middleware asigna el id del usuario autenticado en req.userId
    const usuarioId = req.userId;

    // Obtener todos los items del carrito del usuario, incluyendo detalles del producto e imágenes
    const carritoItems = await prisma.Carrito.findMany({
      where: { usuarioId },
      include: {
        producto: {
          include: {
            imagenes: true,
          },
        },
      },
    });

    return res.status(200).json({ carrito: carritoItems });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
