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
            return res.status(500).json({ message: "Error al obtener el usuario en get user", error:error.message });
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
        const { carrera, nombre, isActive } = req.query;
        console.log(carrera, nombre, isActive); // Verifica si los parámetros llegan correctamente
        try {
            const users = await userModel.getUserFilter({carrera, isActive, nombre });
    
            if (!users || users.length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado desde antes" });
            }

            return res.status(200).json({
                users: users,
                conts: users.length,
                message: users.length>0?"Usuario encontrado ":"Usuario no encontrado"

            });
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            return res.status(500).json({ message: "Error al obtener los usuarios geeet", error:error.message });
        }
    }
    static async postUser(req, res) {
        const { nombre, rut, carrera } = req.body;
        try {
            const user = await userModel.createUser({ rut, nombre, carrera });
            if(user.create == false){
                return res.status(404).json({ message: user.message, user: user.user });
            }
            return res.status(201).json()
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener el usuario ???", error:error.message });
        }
    }
    static async deactivateUser(req, res) {
        const { rut } = req.body;
        try {
            const user = await userModel.desactivUser({ rut });
            if (user.length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: "Error al desactivar usuario", error:error.message });
        }
    }
            
}