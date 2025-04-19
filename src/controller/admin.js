import { adminModel } from "../models/admin.js";
import { validateAdminParse } from "../schema/adminSchema..js";
import { jwtGenerate } from "../utils/jwtGenerate.js";

export class adminController {
    static async login(req, res) {
        const result1 = validateAdminParse(req.body);
        if (!result1.success) {
            return res.status(400).json({ message: "Error en la validacion", errors: result1.error.errors });
        }
        try {
            const result = await adminModel.login( {input: result1.data });
            if (result.inicio == false) {
                return res.status(401).json({ message: result.message });
            }
            const token = jwtGenerate(result);
            return res.status(200).json({token, message: "Inicio de sesión exitoso", usuario: result.usuario });
        } catch (error) {
            return res.status(401).json({ message: "Error en el login",error:error.message });
        }
    }
}