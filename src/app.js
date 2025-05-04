import express from 'express';
import morgan from 'morgan';
import router from './routes/index.js';
import adminRouter from './routes/admin.js';
import { corsMiddleware } from './middlewares/corsMiddelwares.js';
import cookieParser from 'cookie-parser';

const app = express();

// Middlewares
app.use(corsMiddleware());

app.options(/.*/, corsMiddleware());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/admin', adminRouter);
app.use('/user', router);


export default app;
