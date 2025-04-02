import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import logger from './utils/logger.js'; // Importamos el logger personalizado

// Importación de las rutas
import user from './routes/User.routes.js';
import politicas from './routes/Politicas.routes.js';
import terminos from './routes/Terminos.routes.js';
import deslinde from './routes/Deslinde.routes.js';
import logo from './routes/Logo.routes.js';
import Producto from './routes/Producto.routes.js';
import Prediccion from './routes/Prediccion.routes.js';



// Array con los orígenes permitidos
const allowedOrigins = [
    'http://localhost:3000',
    'https://corazonhuateco.netlify.app',
    'https://proyecto-7mo-fronted.vercel.app'
];

// Crea la instancia de Express
const app = express();

app.disable('x-powered-by');

app.use(helmet());
app.use(helmet.frameguard({ action: 'deny' }));

// CSP Config
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://www.google.com",
        "https://www.gstatic.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https://res.cloudinary.com"
      ],
      connectSrc: [
        "'self'",
        ...allowedOrigins
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      frameSrc: [
        "'self'",
        "https://www.google.com"
      ]
    }
  })
);

// ==================== MIDDLEWARES ====================
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Logger middleware (importado desde utils/logger.js)
app.use(logger);

// Rutas
app.use('/api/auth', user);
app.use('/api/docs', politicas);
app.use('/api/docs', terminos);
app.use('/api/docs', deslinde);
app.use('/api/logo', logo);
app.use('/api/productos', Producto);
app.use('/api/prediccion', Prediccion);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    status: 'active',
    message: 'Backend operativo',
    timestamp: new Date().toISOString()
  });
});

// 404 - Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint no encontrado',
    path: req.path,
    method: req.method
  });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error('Error global:', err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ocurrió un error'
  });
});

export default app;
