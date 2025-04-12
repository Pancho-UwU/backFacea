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
            return res.status(500).json({ message: "Error al obtener el usuario en get usre" });
        }
    }
    static async getAllUsers(req, res) {
        try{
            const {limit, lastkey} = req.query
            const {items, lastkey:nextkey,totalPage,itemsTotal} = await userModel.getAllUsers({
                limit: parseInt(limit),
                lastkey: lastkey ? decodeURIComponent(lastkey):undefined
            });
            if (!items.length === 0 || !items) {
                return res.status(404).json({ message: "No hay usuarios disponibles" });
            }
            return res.status(200).json({
                
                items,
                lastkey:nextkey,
                cantItems: itemsTotal,
                cantPage:totalPage
            });
        }
        catch(error){
            return res.status(500).json({ message: "Error al obtener los usuarios"+ error.message });
        }
    }
    
    static async getAllUsersFilter(req, res) {
        const { carrera, nombre, isActive,limit, lastkey} = req.query;
        try {
            const {items,lastkey:nextkey,itemsTotal,contPage} = await userModel.getUserFilter({carrera, 
                isActive, 
                nombre, 
                limit:parseInt(limit), 
                lastkey: lastkey ? decodeURIComponent(lastkey): null });
    
            if (!items || items.length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            return res.status(200).json({
                items,
                lastkey: nextkey,
                conts: itemsTotal,
                cantPage: contPage,
                message: items.length>0?"Usuario encontrado ":"Usuario no encontrado"

            });
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            return res.status(500).json({ message: "Error al obtener los usuarios" });
        }
    }
    static async postUser(req, res) {
        const { nombre, rut, carrera } = req.body;
        try {
            const user = await userModel.createUser({ rut, nombre, carrera });
            if (!user) {
                return res.status(404).json({ message: "Usuario no creado" });
            }
            if(user.create == false){
                return res.status(404).json({ message: user.message });
            }
            return res.status(201).json(user);
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
    static async actualizarUsuario(req,res)
    {
        try{
        const { rut } = req.params
        const body = req.body
        if(!rut){
            return res.status(400).json({message:'EL rut es requerido'}) 
        }
        if(Object.keys(body).length===0){
            return res.status(400).json({message:'Se debe de actualizar por lo menos un parametro'}) 
        }

        const result =await userModel.updateUser({rut,...body});
        return res.status(200).json(result);
        }catch(error){
            return res.status(500).json({message:'error al actualizar ' + error.message})
        }

    }
            
}