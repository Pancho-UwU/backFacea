import { ScanCommand } from '@aws-sdk/client-dynamodb';
import client from '../dataBase/Database.js';
import bcrypt from 'bcryptjs';

export class adminModel
{
    static async login(user, password) {
        const params = {
                    TableName: "admins",
                    FilterExpression: 'usuario = :usuario',
                    ExpressionAttributeValues: {
                        ':usuario': {S: user},
                    },
                };
                try{
                    const result = await client.send(new ScanCommand(params));
                    if (result.Items.length === 0) {
                        throw new Error("Usuario no encontrado");
                    }
                    const user = result.Items.map(items =>({
                        id: items.id.S,
                        nombre: items.nombre.S,
                        usuario: items.usuario.S,
                        contrasenia: items.contrasenia.S,
                    }))
                    
                    const admin = user[0];
                    
                    
                    const passwordMatch = await bcrypt.compare(password, admin.contrasenia);
                    
                    if (!passwordMatch) {
                        return { message: "Contraseña incorrecta",
                            inicio:false
                         };               }   
                    
                    return admin; // Retorna el super admin encontrado
                }catch(error){
                    console.error('Error al obtener el  admin:', error);
                    throw new Error('Error al obtener el admin');
                }
                     
    }


}