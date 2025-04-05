import express from 'express';
import morgan from 'morgan';
import router from './routes/index.js';
import superAdmin from './routes/superAdmin.js';
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
app.use('/api', router);
app.use('/SuperAdmin',superAdmin)

export default app;
