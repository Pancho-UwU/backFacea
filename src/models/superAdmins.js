import { dynamoDBDoc } from "../dataBase/Database.js";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";

export class superAdminModel{
 
    static async registerAdmin(adminData) {
        try {
            const { id, username, password } = adminData;
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

            const params = {
                TableName: "admins",
                Item: {
                    id,
                    username,
                    password: hashedPassword,
                },
            };

            await dynamoDBDoc.put(params).promise();
            return { message: "Admin registered successfully" };
        } catch (error) {
            throw new Error("Error registering admin: " + error.message);
        }
    }
    static async loginSuperAdmin(usuario, password) {
        
        const params = {
            TableName: "superAdmins",
            FilterExpression: 'usuario = :usuario',
            ExpressionAttributeValues: {
                ':usuario': usuario,
            },
        };
        try{
            const result = await dynamoDBDoc.scan(params).promise();
            console.log(result.Items);
            if (result.Items.length === 0) {
                throw new Error("Usuario no encontrado");
            }
            
            const superAdmin = result.Items[0];
            const passwordMatch = await bcrypt.compare(password, superAdmin.contrasenia);
            
            if (!passwordMatch) {
                throw new Error("Contraseña incorrecta");
            }
            
            return superAdmin; // Retorna el super admin encontrado
        }catch(error){
            console.error('Error al obtener el super admin:', error);
            throw new Error('Error al obtener el super admin');
        }
                
    
    }
    static async getAllSuperAdmins() {
        try {
            const params = {
                TableName: "superAdmins",
            };
            const result = await dynamoDBDoc.scan(params).promise();
            return result.Items;
        } catch (error) {
            throw new Error("Error fetching super admins: " + error.message);
        }
    }

}