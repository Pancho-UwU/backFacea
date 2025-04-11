import { v4 as uuidv4 } from 'uuid';
import { dynamoDBDoc } from "../dataBase/Database.js";
import {validatorRut}  from "../validators/validatorRut.js";

export class userModel
{
    /*
    Metodo para obtener un usuario por rut, este metodo esta probado y funciona
    */
    static async getUser({rut})
    {

        const params={
            TableName:'usuarios',
            FilterExpression: 'rut = :rut AND isActive = :isActive',
            ExpressionAttributeValues: {
                ':rut': rut,
                ':isActive': 1,
            },
        };
        try{
            const result = await dynamoDBDoc.scan(params).promise();
            return result.Items[0] 
        }catch(error){
            console.error('Error al obtener el usuario:', error);
            throw new Error('Error al obtener el usuario');
        }
    }

    /*
    Metodo para obtener usuarios filtrados, por carrera y si esta activo, tambien sirve para buscar por nombre.
    metodo probado busqueda .  
    */
    static async getUserFilter({ carrera, isActive, nombre }) {
        const params = {
            TableName: 'usuarios',
        };
    
        const filterExpressions = [];
        const expressionAttributeValues = {};
        
        if (nombre)
            {
                filterExpressions.push('nombre = :nombre');
                expressionAttributeValues[':nombre'] = nombre;
            }
        if (carrera) {
            filterExpressions.push('carrera = :carrera');
            expressionAttributeValues[':carrera'] = carrera;
        }
        // Siempre añadimos isActive al filtro
        filterExpressions.push('isActive = :isActive');
        expressionAttributeValues[':isActive'] = isActive !== undefined ? 
        (typeof isActive === 'string' ? parseInt(isActive, 10) : isActive) : 1;
    
        // Si hay filtros, se agregan al scan
        if (filterExpressions.length > 0) {
            params.FilterExpression = filterExpressions.join(' AND ');
            params.ExpressionAttributeValues = expressionAttributeValues;
        }
    
        console.log('DynamoDB Filter Params:', JSON.stringify(params, null, 2)); // Depuración
    
        try {
            // Si no hay filtros, scan traerá todos los elementos
            const result = await dynamoDBDoc.scan(params).promise();
            return result.Items;
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            throw new Error('Error al obtener los usuarios');
        }
    }
    /*
    Metodo para crear un usario a traves de tres credenciales.
    @param {isActive}: estado del actividad 1 para usuario activo 0 para inactivo 
    @param {carrera}: carrera del usuario
    @param {nombre}: nombre del usuario
    @return {Object}: objeto con los datos del usuario creado
    */
    static async createUser({rut, carrera,nombre})
    {
        if (!rut || !carrera || !nombre) {
            return { message: 'Faltan datos',
                create: false,
             };
        }

        if (!validatorRut.validarRutChileno(rut)) {
            console.log('El rut no es valido', rut); 
            return { message: 'El rut no es valido',
                create: false,
             };
        }

        // Verificar si el usuario ya existe
        const existingUser = await this.getUser( {rut} );
        if (existingUser) {
            return { message: 'Usuario ya existe',
                create: false,
             };
        }
        const carrerasValidas = ['Ingeniería en Información y Control de Gestión', 'Contador auditor', 'Ingeniería comercial'];
        if(!carrerasValidas.includes(carrera)){
            return { message: 'La carrera no es válida',
                create: false,
            }
        }
        const params = {
            TableName: 'usuarios',
            Item: {
                rut: rut,
                carrera: carrera,
                nombre: nombre,
                isActive: 1,
                id: uuidv4(),
            },
        };
    
        try {
            await dynamoDBDoc.put(params).promise();
            console.log('Usuario creado:', params.Item);
            return params.Item;
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            throw new Error('Error al crear el usuario');
        }

    }
    /*
    Metodo para obtener todos los usuarios activos, este metodo esta probado y funciona
    */
    static async getAllUsers()
    {
        const params={
            TableName:'usuarios',
            FilterExpression: 'isActive = :isActive',
            ExpressionAttributeValues: {
                ':isActive': 1,
            },
        };
        try{
            const result = await dynamoDBDoc.scan(params).promise();
            return result.Items 
        }catch(error){
            console.error('Error al obtener el usuario:', error);
            throw new Error('Error al obtener el usuario');
        }
    }
    /*
    Metodo para actualizar el estado de un usuario, este metodo esta probado y funciona
    */
    static async desactivUser({rut}){

        if (!rut) {
            return { message: 'Faltan datos' };
        }
        
        const userP = await this.getUserByRut(rut);
        if (!userP) {
            return { message: 'Usuario no encontrado' };
        }
        

        const params = {
            TableName: 'usuarios',  
            Key: { id: userP[0].id},
            UpdateExpression: 'set isActive = :isActive',
            ExpressionAttributeValues: {
                ':isActive': userP[0].isActive == 0 ? 1 : 0, // Cambia el estado de isActive
            },
        };

        try {
            console.log("holaa")
            await dynamoDBDoc.update(params).promise();
            console.log('Usuario desactivado:', rut);
            return { message: 'Usuario desactivado/activado' };
        } catch (error) {
            console.error('Error al desactivar el usuario:', error);
            throw new Error('Error al desactivar el usuario PLSSS');
        }
    }
    /*
    Metodo para encontrar usuarios de acuerdo a su rut, este metodo esta probado y funciona
    @param {rut}: rut del usuario a buscar
    @return{Object}: objeto con los datos del usuario encontrado
    */
    static async getUserByRut(rut)
    {
        const params = {
            TableName: 'usuarios',
            FilterExpression: 'rut = :rut',
            ExpressionAttributeValues: {
                ':rut': rut,
            },
        };
        try{
            const result = await dynamoDBDoc.scan(params).promise();
            return result.Items 
        }catch(error){
            console.error('Error al obtener el usuario:', error);
            throw new Error('Error al obtener el usuario');
        }
    }

}