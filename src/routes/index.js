import { Router } from 'express';
import { usuarioController } from '../controller/user.js';
import { checkToJWTExpireTime } from '../controller/jwt.js'
import { authMiddleware } from '../middlewares/authMiddelwares.js';
import { authLimiter } from '../middlewares/authLimitMiddelwares.js';


const router = Router();

router.get('/filtro',authMiddleware, usuarioController.getAllUsersFilter);
router.post('/crear', authMiddleware,usuarioController.postUser);
router.put('/actualizarUsuario/:rut', usuarioController.actualizarUsuario)
router.put('/actualizar',authMiddleware,usuarioController.deactivateUser);
router.get('/all',authMiddleware,usuarioController.getCompletUser);
router.get('/:rut', authLimiter,usuarioController.getUser); 
router.get('/', authMiddleware,usuarioController.getAllUsers);



export default router;
    