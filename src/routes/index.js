import { Router } from 'express';
import { usuarioController } from '../controller/user.js';
import { authMiddleware } from '../middlewares/authMiddelwares.js';

const router = Router();

router.get('/filtro',authMiddleware ,usuarioController.getAllUsersFilter);
router.post('/crear',authMiddleware ,usuarioController.postUser);
router.put('/actualizar', authMiddleware,usuarioController.deactivateUser);
router.get('/:rut', usuarioController.getUser); // esta debe ir al final
router.get('/', authMiddleware, usuarioController.getAllUsers);



export default router;
    