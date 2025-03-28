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


// Configuración de CORS para producción
const listWhite = [
    //'http://localhost:3000',
    'https://proyecto-7mo-fronted.vercel.app',
    //'http://192.168.1.70:5000',
    //'http://192.168.1.82:5000',
];

const corsOptions = {
    origin: listWhite,  // Permitir orígenes definidos
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,  // Importante para enviar cookies
    allowedHeaders: ['Content-Type', 'Authorization'],
};


const app = express();
// Implementamos helmet con configuraciones avanzadas
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "https://apis.google.com"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
                connectSrc: ["'self'", "https://api.tuservidor.com"],
                frameSrc: ["'none'"], //  Bloquea iframes externos (Anti-Clickjacking)
            },
        },
        frameguard: { action: "deny" }, // Bloquea iframes maliciosos (Anti-Clickjacking)
        xssFilter: true, //  Protege contra XSS
        noSniff: true, //  Evita que los navegadores infieran tipos de archivo incorrectamente
        referrerPolicy: { policy: "no-referrer" }, //  Evita que se envíe la URL de referencia a otros sitios
        crossOriginEmbedderPolicy: true, //  Bloquea recursos de origen cruzado peligrosos
        crossOriginResourcePolicy: { policy: "same-origin" }, //  Solo permite recursos del mismo dominio
    })
);

// Eliminamos la cabecera X-Powered-By para evitar divulgar información del servidor
app.disable("x-powered-by");

// Evitamos la revelación de IP privada eliminando encabezados no necesarios
app.use((req, res, next) => {
    delete req.headers["x-forwarded-for"];
    next();
});

// Normalización de timestamps en respuestas JSON para evitar divulgación de marcas de tiempo Unix
app.use((req, res, next) => {
    res.json = ((originalJson) => {
        return function (data) {
            if (data.timestamp) {
                data.timestamp = new Date(data.timestamp * 1000).toISOString();
            }
            originalJson.call(this, data);
        };
    })(res.json);
    next();
});


app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
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
