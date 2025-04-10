import { adminModel } from "../models/admin.js";

export class adminController {
    static async login(req, res) {
        const { usuario, contrasenia } = req.body;
        try {
            const result = await adminModel.login( usuario, contrasenia );
            if (result.inicio == false) {
                return res.status(401).json({ message: result.message });
            }
            return res.status(200).json(result);
        } catch (error) {
            return res.status(401).json({ message: "Error logging in admin",error:error.message });
        }
    }
}