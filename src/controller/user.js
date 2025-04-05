import { userModel } from "../models/User.js";

export class usuarioController {
    static async getUser(req, res) {
        const { rut } = req.params;
        try {
            const user = await userModel.getUser({ rut });
            if (user.length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener el usuario" });
        }
    }
    static async getAllUsers(req, res) {
        try{
            const users = await userModel.getAllUsers();
            if (users.length === 0) {
                return res.status(404).json({ message: "No hay usuarios disponibles" });
            }
            return res.status(200).json(users);
        }
        catch(error){
            return res.status(500).json({ message: "Error al obtener los usuarios" });
        }
    }
    static async getAllUsersFilter(req, res) {
        console.log('Query Parameters:', req.query); // Verifica si los parámetros llegan correctamente
        const { rut, generacion, carrera } = req.query;
    
        
    
        try {
            const users = await userModel.getUserFilter({ rut, generacion, carrera });
    
            if (!users || users.length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            return res.status(200).json(users);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            return res.status(500).json({ message: "Error al obtener los usuarios" });
        }
    }
    
        
}