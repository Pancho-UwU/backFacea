import {superAdminModel} from "../models/superAdmins.js";

export class superAdminController {
    static async registerSuperAdmin(req, res) {
        const { id, username, password } = req.body;
        try {
            const result = await superAdminModel.registerSuperAdmin({ id, username, password });
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: "Error registering super admin" });
        }
    }
    static async login(req,res){
        const { usuario, contrasenia } = req.body;
        try{
            const result = await superAdminModel.loginSuperAdmin(usuario, contrasenia);
            return res.status(200).json(result);
        }catch(error){
            return res.status(401).json({ message: "Error logging in super admin" });
        }
    }


    static async getAllSuperAdmins(req, res) {
        try {
            const superAdmins = await superAdminModel.getAllSuperAdmins();
            return res.status(200).json(superAdmins);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching super admins" });
        }
    }
}