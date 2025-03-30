import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

// Importación de las rutas
import user from './routes/User.routes.js';
import politicas from './routes/Politicas.routes.js';
import terminos from './routes/Terminos.routes.js';
import deslinde from './routes/Deslinde.routes.js';
import logo from './routes/Logo.routes.js';
import Producto from './routes/Producto.routes.js';
import Prediccion from './routes/Prediccion.routes.js';

// Crea la instancia de Express
const app = express();

// Array con los orígenes permitidos
const allowedOrigins = [
    'http://localhost:3000',
    'https://proyecto-7mo-fronted.vercel.app'
];

// Configuración de CORS
app.use(cors({
  origin: function (origin, callback) {
    console.log("Origin recibida:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token', 'x-access-notification']
}));

// Seguridad adicional con Helmet y configuración de CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'nonce-randomString'", // Usa un nonce dinámico en cada respuesta
        "https://www.google.com",
        "https://www.gstatic.com",
        "https://www.recaptcha.net"
      ],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: [
        "'self'",
        "http://localhost:4000",
        "http://localhost:3000",
        "https://api.pwnedpasswords.com",
        "https://www.google.com",
        "https://www.gstatic.com",
        "https://proyecto-7mo-fronted.vercel.app",
        "https://proyecto-7mo-backend.onrender.com"
      ],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      frameSrc: ["'self'", "https://www.google.com", "https://www.gstatic.com"]
    }
  }
}));

// Evita la divulgación de información interna
app.disable('x-powered-by');

// Agrega el header X-Content-Type-Options para evitar sniffing
app.use(helmet.noSniff());

// Control de caché para evitar almacenamiento de información sensible
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// Otros middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Rutas
app.use('/api/auth', user);
app.use('/api/docs', politicas);
app.use('/api/docs', terminos);
app.use('/api/docs', deslinde);
app.use('/api/logo', logo);
app.use('/api/productos', Producto);
app.use('/api/prediccion', Prediccion);

app.get('/', (req, res) => {
  res.json({ msg: "Bienvenido a la API de tu proyecto" });
});

// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta incorrecta' });
});

export default app;
