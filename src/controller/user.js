import { number } from "zod";
import { userModel } from "../models/User.js";
import { validatePartialUserCreate, validatePartialUserUpdate, validateUserCreate } from "../schema/userSchema.js";

export class usuarioController {
    static async getUser(req, res) {
        const result = validatePartialUserCreate(req.params);
        if (!result.success) {
            return res.status(400).json({ message: "Error en la validacion", errors: result.error.errors });
        }
        try {
            const {user,message} = await userModel.getUser({ input: result.data });
            if (!user||user.length === 0||message) {
                return res.status(404).json({ message: message });
            }
            return res.status(200).json(user);
        } catch (error) {
            
            return res.status(500).json({ message: "Error al obtener el usuario en get usre"+ error.message });
        }
    }
    static async getAllUsers(req, res) {
        try{
            const {limit,page } = req.query
            const {items, itemsTotal,contPage} = await userModel.getAllUsers({
                limit: Number.isNaN(limit)?10:limit,
                page: Number.isNaN(page)? 0 :page,
            });
            if (!items.length === 0 || !items) {
                return res.status(404).json({ message: "No hay usuarios disponibles" });
            }
            return res.status(200).json({
                
                items,
                cantItems: itemsTotal,
                cantPage:contPage
            });
        }
        catch(error){
            return res.status(500).json({ message: "Error al obtener los usuarios"+ error.message });
        }
    }
    static async getAllUsersFilter(req, res) {
        const { carrera, nombre, isActive,limit, page} = req.query;
        try {
            const {items,itemsTotal,contPage, message} = await userModel.getUserFilter({carrera, 
                isActive, 
                nombre, 
                limit: Number.isNaN(limit)?10:limit, 
                page: Number.isNaN(page) ? 0 : page
            })
            if (!items || items.length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado asfasf "+ items.length });
            }
            return res.status(200).json({
                items,
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

        console.log(req.body)
        const result = validateUserCreate(req.body);
        if (!result.success) {
            return res.status(400).json({ message: "Error en la validacion estaa", errors: result.error.errors });
        }
        try {
            const user = await userModel.createUser({input:result.data}); 
            console.log(user)
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
        const result = validatePartialUserCreate(req.body);
        if (!result.success) {
            return res.status(400).json({ message: "Error en la validacion", errors: result.error.errors });
        }
        try {
            const user = await userModel.desactivUser({ input: result.data });
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
            const result1 = validatePartialUserCreate(req.params);
            const result2= validatePartialUserUpdate(req.body);
            
            if (!result1.success) {
                return res.status(400).json({ message: "Error en la validacion", errors: result.error.errors });
            }
            if (!result2.success) {
                return res.status(400).json({ message: "Error en la validacion", errors: result2.error.errors });
            }
            const result =await userModel.updateUser({input1:result1.data,input2:result2.data});
            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json({message:'error al actualizar ' + error.message})
        }

    }
    static async getCompletUser(req,res){
        try{
            const result = await userModel.getAllUsersComplete();
            if (!result || result.length === 0) {
                return res.status(404).json({ message: "No hay usuarios disponibles" });
            }
            return res.status(200).json(result);

        }catch(error){
            return res.status(500).json({ message: "Error al obtener los usuarios"+ error.message });
        }
    }
}