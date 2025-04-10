import { dynamoDBDoc } from "../dataBase/Database.js";
import bcrypt from 'bcryptjs';

export class adminModel
{
    static async login(user, password) {
        const params = {
                    TableName: "admins",
                    FilterExpression: 'usuario = :usuario',
                    ExpressionAttributeValues: {
                        ':usuario': user,
                    },
                };
                try{
                    const result = await dynamoDBDoc.scan(params).promise();
                    if (result.Items.length === 0) {
                        throw new Error("Usuario no encontrado");
                    }
                    
                    const admin = result.Items[0];
                    
                    /*
                    const passwordMatch = await bcrypt.compare(password, admin.contrasenia);
                    
                    if (!passwordMatch) {
                        return { message: "Contraseña incorrecta",
                            inicio:false
                         };               }   
                    */
                    return admin; // Retorna el super admin encontrado
                }catch(error){
                    console.error('Error al obtener el  admin:', error);
                    throw new Error('Error al obtener el admin');
                }
                     
    }


}