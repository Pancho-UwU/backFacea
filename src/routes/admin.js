import { Router } from 'express';
import { adminController } from '../controller/admin.js';

const adminRouter = Router();

adminRouter.post('/login', adminController.login);

export default adminRouter;
