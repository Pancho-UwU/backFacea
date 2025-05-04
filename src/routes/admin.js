import { Router } from 'express';
import { adminController } from '../controller/admin.js';
import { authLimiter } from '../middlewares/authLimitMiddelwares.js';
import {refreshToken } from '../controller/jwt.js';
const adminRouter = Router();

adminRouter.post('/login',authLimiter ,adminController.login);
adminRouter.post('/refresh', refreshToken);

export default adminRouter;
