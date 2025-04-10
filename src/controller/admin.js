import { adminModel } from "../models/admin.js";
import { jwtGenerate } from "../utils/jwtGenerate.js";

export class adminController {
    static async login(req, res) {
        const { usuario, contrasenia } = req.body;
        

        try {
            const result = await adminModel.login( usuario, contrasenia );
            if (result.inicio == false) {
                return res.status(401).json({ message: result.message });
            }
            console.log(result, "holas");
            const token = jwtGenerate(result);
            console.log(token, "token generado");
            return res.status(200).json({token, message: "Inicio de sesión exitoso", usuario: result.usuario });
        } catch (error) {
            return res.status(401).json({ message: "Error logging in admin",error:error.message });
        }
    }
}