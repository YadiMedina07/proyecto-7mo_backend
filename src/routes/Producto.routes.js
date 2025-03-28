import { Router } from 'express';
import { upload } from '../config/cloudinaryConfig.js';
import * as ProductosController from '../controllers/Producto.controller.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = Router();

// Rutas para el carrito: se definen primero para evitar conflicto con /:id
router.post('/carrito', isAuthenticated, ProductosController.agregarProductoCarrito);
router.get('/carrito', isAuthenticated, ProductosController.obtenerCarrito);

// Crear producto (sólo admin)
router.post('/crear', isAuthenticated, isAdmin, upload.array('images'), ProductosController.crearProducto);

// Actualizar producto (sólo admin)
router.put('/:id', isAuthenticated, isAdmin, upload.array('images'), ProductosController.actualizarProducto);

// Obtener todos los productos (público)
router.get('/', ProductosController.obtenerProductosAdmin);

// Obtener producto por ID (público)
router.get('/:id', ProductosController.obtenerProductoPorId);

// Eliminar producto (sólo admin)
router.delete('/:id', isAuthenticated, isAdmin, ProductosController.eliminarProducto);

export default router;
