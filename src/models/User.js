import { v4 as uuidv4 } from 'uuid';
import client from '../dataBase/Database.js';
import {validatorRut}  from "../validators/validatorRut.js";
import { GetItemCommand, PutItemCommand, ReturnValue, ScanCommand } from '@aws-sdk/client-dynamodb';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';


export class userModel
{
    /*
    Metodo para obtener un usuario por rut, este metodo esta probado y funciona
    */
    static async getUser({input})
    {
        const { rut } = input;
        
        const params={
            TableName:'usuarios2',
            Key:{
                rut:{S: rut}
            }
        };
        try{
            const result = await client.send(new GetItemCommand(params));
            if(result.Item && result.Item.isActive.S === "1"&& result.Item.isActive){
                return user = {
                    id: result.Item.id.S,
                    nombre: result.Item.nombre.S,
                    rut: result.Item.rut.S,
                    carrera: result.Item.carrera.S,
                    isActive: result.Item.isActive.S
                };
            }
                else{
                    return { message: 'Usuario no encontrado o inactivo' };
                }
            
        }catch(error){
            console.error('Error al obtener el usuario:', error);
            throw new Error('Error al obtener el usuario');
        }
    }

    /*
    Metodo para obtener usuarios filtrados, por carrera y si esta activo, tambien sirve para buscar por nombre.
    metodo probado busqueda .  
    */
    static async getUserFilter({ carrera, isActive, nombre,limit = 10, page = 0 }) {
        const params = {
            TableName: 'usuarios',
        };
  
        try {
            // Si no hay filtros, scan traerá todos los elementos
            const result = await client.send(new ScanCommand(params))
            let users = result.Items.map(items=>({
                id: items.id.S,
                nombre: items.nombre.S,
                carrera: items.carrera.S,
                rut: items.rut.S,
                isActive: items.isActive.S

            }))

            if (nombre) {
               
                users = users.filter(user => {
                    const userNameLower = user.nombre.toLowerCase().trim();
                    const searchTermLower = nombre.toLowerCase().trim();
                    const matches = userNameLower.includes(searchTermLower);
                    return matches;
                });
            }

            if(carrera){
                users = users.filter(user => {
                    const userCarreraLower = user.carrera.toLowerCase().trim();
                    const searchTermLower = carrera.toLowerCase().trim();
                    const matches = userCarreraLower.includes(searchTermLower);
                    return matches;
                });
            }
            if(isActive === undefined){
                users = users.filter(user => user.isActive === "1");
            }
            else{
                users = users.filter(user => user.isActive === isActive);
            }
            let inicio = page*limit
            let fin = parseInt(inicio)+parseInt(limit)
            if(users.length === 0){
                return{
                    items:[],
                    itemsTotal: users.length,
                    contPage:  Math.ceil(users.length / limit),
                    message:"no hay usuarios"
                }
            }
            const usersReturn =users.slice(inicio,fin)
            return {items: usersReturn,
                itemsTotal: users.length,
                contPage: Math.ceil(users.length / limit),
            };
        } catch (error) {
            console.error('Error al obtener los usuarios:'+ error.message);
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
    static async createUser({input})
    {
        const { rut, nombre, carrera } = input;


        if (!validatorRut.validarRutChileno(rut)) {
            return { message: 'El rut no es valido',
                create: false,
             };
        }
                
        // Verificar si el usuario ya existe
        const existingUser = await this.getUserByRut(rut);
        if (existingUser.length !== 0 ) {
            return { message: 'Usuario ya existe',
                create: false,
             };
        }

        const params = {
            TableName: 'usuarios',
            Item: {
                'rut': { S: rut },  
                'id': { S: uuidv4() },  
                'nombre': { S: nombre }, 
                'carrera': { S: carrera },
                'isActive': { S: "1" },
                
            },
        };
        try {
            await client.send(new PutItemCommand(params));
            const user ={
                id: params.Item.id.S,
                rut: params.Item.rut.S,
                nombre: params.Item.nombre.S,
                carrera: params.Item.carrera.S,
                isActive: params.Item.isActive.S
            }
            return user;
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            throw new Error('Error al crear el usuario');
        }

    }
    /*
    Metodo para obtener todos los usuarios activos, este metodo esta probado y funciona
    */
    static async getAllUsers({limit=10, page=0})
    {
        const params={
            TableName:'usuarios',
            FilterExpression: 'isActive = :isActive',
            ExpressionAttributeValues: {
                ':isActive': {S: '1'},
            },
        };
        
        try{

            const result = await client.send(new ScanCommand(params));
            if(!result.Items || result.Items.length === 0){
                return[]
            }
            const users = result.Items.map(items=>({
                id:items.id.S,
                nombre: items.nombre.S,
                rut:items.rut.S,
                carrera:items.carrera.S,
                isActive: items.isActive.S
            }))
            let inicio = page*limit
            let fin = parseInt(inicio)+parseInt(limit)
            if(inicio >=users.length){
                return{
                    items:[],
                    itemsTotal: users.length,
                    contPage:  Math.ceil(users.length / limit),
                    message:"Página fuera del rango"
                }
            }
            const usersReturn =users.slice(inicio,fin)
            return {items: usersReturn,
                itemsTotal: users.length,
                contPage: Math.ceil(users.length / limit),
            };
            
        }catch(error){
            console.error('Error al obtener el usuario:', error);
            throw new Error('Error al obtener el usuario'+error.message);
        }
    }

    static async getAllUsersComplete()
    {
        const params={
            TableName:'usuarios',
            FilterExpression: 'isActive = :isActive',
            ExpressionAttributeValues: {
                ':isActive': {S: '1'},
            },
        };
        
        try{

            const result = await client.send(new ScanCommand(params));
            if(!result.Items || result.Items === 0){
                return[]
            }
            const users = result.Items.map(items=>({
                id:items.id.S,
                nombre: items.nombre.S,
                rut:items.rut.S,
                carrera:items.carrera.S,
                isActive: items.isActive.S
            }))
            
            return users;
            
        }catch(error){
            console.error('Error al obtener el usuario:', error);
            throw new Error('Error al obtener el usuario'+error.message);
        }
    }



    /*
   
    @
    */
    static async updateUser({input1, input2}) {
        const { rut } = input1;
        const objeto = input2;
        
        // Check if user exists
        const userShear = await this.getUserByRut(rut);
        if(!userShear || userShear.length === 0) {
            return { message: 'Usuario no existe' };
        }
        
        // Check if update data is provided
        if(Object.keys(objeto).length === 0) {
            return { message: 'Datos no enviados' };
        }
        
        // Manejar la actualización de RUT (si existe rutB en el objeto)
        let nuevoRut = null;
        if(objeto.rutB) {
            // Solo validar el nuevo RUT si es diferente del actual
            if(objeto.rutB !== rut) {
                // Verificar si el nuevo RUT ya existe
                const resultUser = await this.getUserByRut(objeto.rutB);
                if(resultUser && resultUser.length > 0) {
                    return { message: 'Rut a actualizar ya existente: ' + resultUser.length };
                }
                // Guardamos el nuevo valor del RUT
                nuevoRut = objeto.rutB;
            }
        }
        
       
        
        // Procesar resto de campos (excluyendo rutB que ya procesamos)
        for (const key in objeto) {
            if(key !== 'rutB') { // Excluimos rutB ya que lo procesamos por separado
                UpdateExpression_.push(`#${key} = :${key}`);
                ExpressionAttributeValues[`:${key}`] = objeto[key];
                ExpressionAttributeNames[`#${key}`] = key;
            }
        }
        try{
            let result ;
            if(nuevoRut){
                
                
            }
        }
        
        // Parámetros para actualización en DynamoDB
        const params = {
            TableName: 'usuarios',
            Key: { id: userShear[0].id },
            UpdateExpression: 'SET ' + UpdateExpression_.join(', '),
            ExpressionAttributeValues,
            ExpressionAttributeNames,
            ReturnValues: 'ALL_NEW'
        };
        /*
        try {
            console.log('Parámetros de actualización:', JSON.stringify(params, null, 2));
            const result = await client.send(new UpdateCommand(params));
            return { message: 'Usuario actualizado con éxito', data: result.Attributes };
        } catch(error) {
            throw new Error('Error al actualizar el usuario: ' + error.message);
        }
            */
    }
    
    /*
    Metodo para actualizar el estado de un usuario, este metodo esta probado y funciona
    */
    static async desactivUser({input}){

        const { rut } = input;
        const userP = await this.getUserByRut(rut);
        if (!userP) {
            return { message: 'Usuario no encontrado' };
        }
        
        const params = {
            TableName: 'usuarios',  
            Key: { id: userP[0].id},
            UpdateExpression: 'set isActive = :isActive',
            ExpressionAttributeValues: {
                ':isActive': userP[0].isActive == "0" ? '1' : '0', // Cambia el estado de isActive
            },
            ReturnValue: 'UPDATED_NEW' 
        };

        try {
            await client.send(new UpdateCommand(params));

            console.log('Usuario desactivado:', rut);
            return { message: 'Usuario desactivado/activado' };
        } catch (error) {
            console.error('Error al desactivar el usuario:', error);
            throw new Error('Error al desactivar el usuario PLSSS'+error.message);
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
            Key:{
                rut:{S: rut}
            }
        };
        try{
            const result = await client.send(new ScanCommand(params));
            const users = {
                id: result.Item.id.S,
                nombre: result.Item.nombre.S,
                rut: result.Item.rut.S,
                carrera: result.Item.carrera.S,
                isActive: result.Item.isActive.S
            }
            return users
        }catch(error){
            throw new Error('Error al obtener el usuario'+ error.message);
        }
    }
    

}

