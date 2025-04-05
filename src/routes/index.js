import { Router } from 'express';
import { usuarioController } from '../controller/user.js';

const router = Router();

router.get('/filtro/', usuarioController.getAllUsersFilter);
router.get('/:rut',usuarioController.getUser); 
router.get('/', usuarioController.getAllUsers);

export default router;
    