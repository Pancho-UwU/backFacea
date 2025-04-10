import express from 'express';
import morgan from 'morgan';
import router from './routes/index.js';
import adminRouter from './routes/admin.js';
import {seeder} from './dataBase/Seeder.js';
import { corsMiddleware } from './middlewares/corsMiddelwares.js';

const app = express();

// Middlewares
app.use(corsMiddleware());
app.use(morgan('dev'));
app.use(express.json());
seeder().then(() => {
    console.log('Seeder ejecutado correctamente');
}).catch((error) => {
    console.error('Error al ejecutar el seeder:', error);
});
// Rutas
app.use('/admin', adminRouter);
app.use('/user', router);

export default app;
