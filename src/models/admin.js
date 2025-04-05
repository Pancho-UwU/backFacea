import { dynamoDBDoc } from "../dataBase/Database.js";

export class adminModel
{
    static async putUser({rut, nombre, apellido, carrera, generacion, email, password})
    {
        const params={
            TableName:'usuarios',
            Item:{
                rut: rut,
                nombre: nombre,
                apellido: apellido,
                carrera: carrera,
                generacion: generacion,
                email: email,
                password: password
            }
        };
        try{
            const result = await dynamoDBDoc.put(params).promise();
            return result; 
        }catch(error){
            console.error('Error al agregar el usuario:', error);
            throw new Error('Error al agregar el usuario');
        }
    }

}