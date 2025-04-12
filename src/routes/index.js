import { Router } from 'express';
import { usuarioController } from '../controller/user.js';
import { authMiddleware } from '../middlewares/authMiddelwares.js';

const router = Router();

router.get('/filtro', usuarioController.getAllUsersFilter);
router.post('/crear', usuarioController.postUser);
router.put('/actualizar', usuarioController.deactivateUser);
router.get('/:rut', usuarioController.getUser); // esta debe ir al final
router.get('/',  usuarioController.getAllUsers);


export default router;
    