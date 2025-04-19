import { Router } from 'express';
import { adminController } from '../controller/admin.js';
import { authLimiter } from '../middlewares/authLimitMiddelwares.js';

const adminRouter = Router();

adminRouter.post('/login',authLimiter   ,adminController.login);

export default adminRouter;
