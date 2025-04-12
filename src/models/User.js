import { v4 as uuidv4 } from 'uuid';
import client from '../dataBase/Database.js';
import {validatorRut}  from "../validators/validatorRut.js";
import { PutItemCommand, ReturnValue, ScanCommand } from '@aws-sdk/client-dynamodb';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import id from 'faker/lib/locales/id_ID/index.js';
import { object } from 'zod';

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
                ':rut': {S: rut},
                ':isActive': {N: "1"},
            },
        };
        try{
            const result = await client.send(new ScanCommand(params));
            const users = result.Items.map(items=>({
                id: items.id.S,
                nombre: items.nombre.S,
                carrera: items.carrera.S,
                rut: items.rut.S,
                isActive: parseInt(items.isActive.N)

            }))
            return users[0]
        }catch(error){
            console.error('Error al obtener el usuario:', error);
            throw new Error('Error al obtener el usuario');
        }
    }

    /*
    Metodo para obtener usuarios filtrados, por carrera y si esta activo, tambien sirve para buscar por nombre.
    metodo probado busqueda .  
    */
    static async getUserFilter({ carrera, isActive, nombre,limit, lastkey }) {
        const params = {
            TableName: 'usuarios',
            Limit:limit
        };
        const params2={
            TableName: 'usuarios',
        }
        
        const filterExpressions = [];
        const expressionAttributeValues = {};
        
        if (nombre)
            {
                filterExpressions.push('contains(nombre,:nombre)');
                expressionAttributeValues[':nombre'] = {S: nombre};
            }
        if (carrera) {
            filterExpressions.push('carrera = :carrera');
            expressionAttributeValues[':carrera'] = {S: carrera};
        }
        // Siempre añadimos isActive al filtro
        filterExpressions.push('isActive = :isActive');
        expressionAttributeValues[':isActive'] = isActive !== undefined ? { N: String(isActive) } : { N: "1" }; 
    
        // Si hay filtros, se agregan al scan
        if (filterExpressions.length > 0) {
            params.FilterExpression = filterExpressions.join(' AND ');
            params.ExpressionAttributeValues = expressionAttributeValues;
            params2.FilterExpression = filterExpressions.join(' AND ');
            params2.ExpressionAttributeValues = expressionAttributeValues;
            params2.Select='COUNT';
        }
        
    
        if(lastkey)
            {
                params.ExclusiveStartKey = {id:{S: lastkey}}

            }
        let itemsTotal =null
        let totalPage= null
        try {
            // Si no hay filtros, scan traerá todos los elementos
            const result = await client.send(new ScanCommand(params));
            if(lastkey === null || lastkey === undefined)
                {
                    const resultCount = await client.send(new ScanCommand(params2));
                    itemsTotal= resultCount.Count;
                    totalPage = 1
                    if(limit && limit >0)
                        {
                            totalPage = Math.trunc(itemsTotal/limit)+1 ||1

                        }
                    
                }
            const users = result.Items.map(items=>({
                id: items.id.S,
                nombre: items.nombre.S,
                carrera: items.carrera.S,
                rut: items.rut.S,
                isActive: parseInt(items.isActive.N)

            }))
            return {items: users,
                contPage: totalPage,
                itemsTotal,
                lastkey: result.LastEvaluatedKey?.id?.S || null,
            };
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
    static async createUser({rut,carrera,nombre})
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
                'id': { S: uuidv4() },  // Asegúrate de que el tipo es 'S' (String)
                'rut': { S: rut },  // 'rut' como cadena
                'nombre': { S: nombre },  // 'nombre' como cadena
                'carrera': { S: carrera },  // 'carrera' como cadena
                'isActive': { N: "1" },
                
            },
        };
    
        try {
            await client.send(new PutItemCommand(params));
            const user ={
                id: params.Item.id.S,
                rut: params.Item.rut.S,
                nombre: params.Item.nombre.S,
                carrera: params.Item.carrera.S,
                isActive: params.Item.isActive.N
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
    static async getAllUsers({limit, lastkey})
    {
        const params={
            TableName:'usuarios',
            FilterExpression: 'isActive = :isActive',
            ExpressionAttributeValues: {
                ':isActive': {N: '1'},
            },
            Limit: limit+1
        };
        const params2={
            TableName:'usuarios',
            FilterExpression: 'isActive = :isActive',
            ExpressionAttributeValues: {
                ':isActive': {N: '1'},
            }
        };
        if(lastkey)
            {
                params.ExclusiveStartKey = {id:{S: lastkey}};
            }
        let itemsTotal =null
        let totalPage= null
        try{

            const result = await client.send(new ScanCommand(params));
            if(!result.Items || result.Items === 0){
                return[]
            }
            if(lastkey === null || lastkey === undefined)
                {
                    const resultCount = await client.send(new ScanCommand(params2));
                    itemsTotal= resultCount.Count;
                    totalPage = 1
                    if(limit && limit >0)
                        {
                            totalPage = Math.trunc(itemsTotal/limit)+1 ||1

                        }
                    
                }
            const users = result.Items.map(items=>({
                id:items.id.S,
                nombre: items.nombre.S,
                rut:items.rut.S,
                carrera:items.carrera.S,
                isActive: parseInt(items.isActive.N )
            }))
            return {
                items:users,
                totalPage,
                itemsTotal,
                lastkey: result.LastEvaluatedKey?.id?.S || null
                
            } 
        }catch(error){
            console.error('Error al obtener el usuario:', error);
            throw new Error('Error al obtener el usuario'+error.message);
        }
    }
    /*
   
    @
    */
    static async updateUser({rut, ...objeto})
    {
        const userShear = await this.getUserByRut(rut)
        if(!userShear || userShear.length ===0){
            return{message:'usuario no existe'};
        }
        if(Object.keys(objeto).length === 0)
            {
                return {message:'datos no enviados'}
            }
        const UpdateExpression_ =[]
        const ExpressionAttributeValues = {}
        const ExpressionAttributeNames = {}
        if(objeto.rutB === rut || objeto.rutB )
            {
                const restultUser = await this.getUserByRut(objeto.rutB);
                if(restultUser.length >0 || restultUser ){
                    return {message: 'Rut a actualizar ya existente'}
                }
            }
        
        
        for (const key in objeto)
            {
                UpdateExpression_.push(`#${key}= :${key}`);
                ExpressionAttributeValues[`:${key}`]=objeto[key];
                ExpressionAttributeNames[`#${key}`]=key;
            }
                
        const params={
            TableName:'usuarios',
            Key:{id:userShear[0].id},
            UpdateExpression:'SET ' +UpdateExpression_.join(', '),
            ExpressionAttributeValues,
            ExpressionAttributeNames,
            ReturnValue: 'ALL_NEW'
        };
        try{
            const result = await client.send(new UpdateCommand(params));
            return {message: 'Usuario Actualizado con éxito',data: result.Attributes}
        }
        catch(error)
        {
            throw new Error('Error al actualizar el usuario '+ error.message);
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
            ReturnValue: 'UPDATED_NEW' 
        };

        try {
            console.log("holaa")
            await client.send(new UpdateCommand(params));
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
                ':rut': {S: rut},
            },
        };
        try{
            const result = await client.send(new ScanCommand(params));
            const users = result.Items.map(items =>({
                id: items.id.S,
                rut: items.rut.S,
                nombre: items.nombre.S,
                carrera: items.carrera.S,
                isActive: parseInt(items.isActive.N)
            }))
            return users
        }catch(error){
            throw new Error('Error al obtener el usuario'+ error.message);
        }
    }
    

}