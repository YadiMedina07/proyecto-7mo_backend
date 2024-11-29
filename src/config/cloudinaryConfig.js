import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v4 as uuidv4 } from 'uuid';
import cloudinary from 'cloudinary';

// Configuración de Cloudinary
cloudinary.v2.config({
  cloud_name: 'djugmkxms',
  api_key: '318319829499991',
  api_secret: 'ex6O7uUBMdgp9H-IxmfQWD_Z_Cs',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'logo', // Carpeta en Cloudinary
    format: async () => 'png', // Cambia el formato según necesites
    public_id: () => uuidv4(), // Generar un ID único para cada imagen
  },
});

const upload = multer({ storage: storage });

export { upload };
