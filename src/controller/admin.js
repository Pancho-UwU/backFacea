import { adminModel } from "../models/admin.js";
import { validateAdminParse } from "../schema/adminSchema.js";
import { jwtGenerate, jwtGenerateRefresh } from "../utils/jwtGenerate.js";

export class adminController {
    static async login(req, res) {
        const result1 = validateAdminParse(req.body);
        if (!result1.success) {
            return res.status(400).json({ message: "Error en la validacion", errors: result1.error.errors });
        }
        try {
            const result = await adminModel.login( {input: result1.data });
            if (!result.inicio ) {
                return res.status(401).json({ message: result.message });
            }
            const token = jwtGenerate(result);
            res.cookie('token', token,{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'Strict', 
                maxAge:  60 * 60 * 1000 
            })
            const refreshToken = jwtGenerateRefresh(result);
            res.cookie('refreshToken', refreshToken,{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'Strict', 
                maxAge:  24*60 * 60 * 1000
            })
            return res.status(200).json({token, message: "Inicio de sesión exitoso", usuario: result.usuario });
        } catch (error) {
            return res.status(401).json({ message: "Error en el login",error:error.message });
        }
    }
}