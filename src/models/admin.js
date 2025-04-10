import {poolDatabase} from '../dataBase/Database.js';
import bcrypt from 'bcryptjs';

export class adminModel
{
    static async login(user, password) {
        
        const query = `SELECT * FROM admins WHERE usuario = $1`;
        const params = [user];
        const result = await poolDatabase.query(query, params);
        const rows = result.rows;
        if ( rows.length === 0) {
            return { inicio: false, message: "Usuario no encontrado" };
        }
        const passwordHash = await bcrypt.compare(password, rows[0].contrasenia);
        if (!passwordHash) {
            return { inicio: false, message: "Contraseña incorrecta" };
        }
        return {
            inicio: true,
            usuario: rows[0].usuario,
            nombre: rows[0].nombre,
            contrasenia: rows[0].contrasenia,
        };
                     
    }


}