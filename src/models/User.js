import { v4 as uuidv4 } from 'uuid';
import { poolDatabase } from '../dataBase/Database.js';
import {validatorRut}  from "../validators/validatorRut.js";

export class userModel
{
    /*
    Metodo para obtener un usuario por rut, este metodo esta probado y funciona
    */
    static async getUser({rut})
    {
        try{
            let query = `SELECT * FROM usuarios WHERE isActive = 1 and rut = $1`;
            const params = [rut];
            
            const {rows} = await poolDatabase.query(query, params);
            if (rows.length === 0) {
                return {message: 'Usuario no encontrado',
                    user: false,
                }; // Usuario no encontrado
            }
            return rows[0]; // Retorna el usuario encontrado
            
        }
        catch(error){
            console.error('Error al obtener el usuario:', error.message);
            throw new Error('Error al obtener el usuario');
        }
    }

    /*
    Metodo para obtener usuarios filtrados, por carrera y si esta activo, tambien sirve para buscar por nombre.
    metodo probado busqueda .  
    */
    static async getUserFilter({ carrera, isActive, nombre }) {
        let query = `SELECT * FROM usuarios WHERE 1=1`;
        const params = [];
        let paramsIndex = 1;
        if(carrera) {
            query += ` AND carrera = $${paramsIndex++}`;;
            params.push(carrera);
        }
        if (nombre){
            query += ` AND nombre = $${paramsIndex++}`;
            params.push(nombre); // Agrega comodines para búsqueda parcial
        }
        if (isActive!==undefined) {
            query += ` AND isActive = $${paramsIndex++}`;
            params.push(parseInt(isActive)); // Agrega comodines para búsqueda parcial
        }
        else{
            query += ` AND isActive = 1`;    
        }
    
    
        try {
            const {rows} = await poolDatabase.query(query, params);
            if (rows.length === 0) {
                return {message:'Usuario no encontrao',
                    user: false,
                }; // Usuario no encontrado
            }
            return rows; // Retorna el usuario encontrado
        } catch (error) {
            throw new Error('Error al obtener los usuarios desde antes', error.message);
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
        const existingUser = await this.getUserByRut( rut );
        console.log(rut)
        if (existingUser.user) {
            console.log('El usuario no existe', existingUser.user);
            return { message: 'Usuario ya existe wuaaaa',
                create: false,
                user: existingUser,
             };
        }
        const carrerasValidas = ['Ingeniería en Información y Control de Gestión', 'Contador auditor', 'Ingeniería comercial'];
        if(!carrerasValidas.includes(carrera)){
            return { message: 'La carrera no es válida',
                create: false,
            }
        }
        const query = 'INSERT INTO usuarios ( rut, carrera, nombre, isActive) VALUES ( $1, $2, $3, 1) returning *';
        const params = [rut, carrera, nombre];

        try {
            const{rows} = await poolDatabase.query(query, params);
            console.log({message:rows[0],});

            return ({message: 'Usuario creado',
                create: true,
                user: rows[0],
            });
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            throw new Error('Error al crear el usuario giaaaa', error.message);
        }
    }
    /*
    Metodo para obtener todos los usuarios activos, este metodo esta probado y funciona
    */
    static async getAllUsers()
    {
        const query = `SELECT * FROM usuarios WHERE isActive = 1`;
        try {
            const {rows} = await poolDatabase.query(query);
            if (rows.length === 0) {
                return {message:'No hay usuarios activos',
                    user: false,
                }; // Usuario no encontrado
            }
            return rows; // Retorna el usuario encontrado
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            throw new Error('Error al obtener los usuarios');
        }
        
    }
    /*
    Metodo para actualizar el estado de un usuario, este metodo esta probado y funciona
    */
    static async desactivUser({rut}){
        console.log
        if (!rut) {
            return { message: 'Faltan datos' };
        }
        
        const userP = await this.getUserByRut(rut);
        console.log({message:userP});

        if (userP.length === 0 || userP.user === false) {
            console.log('El usuario no existe', userP.user);

            return { message: 'Usuario no encontrado', rut };
        }
        
        const isActive = userP.isactive === 1 ? 0 : 1; // Cambia el estado de isActive

        const query = `UPDATE usuarios SET isActive = $1 WHERE rut = $2 returning *`;
        const params2 = [isActive, rut];
        try {
            const {rows} = await poolDatabase.query(query, params2);
            if (rows.affectedRows === 0) {
                return { message: 'No se pudo actualizar el usuario',
                    user: false,
                 };
            }
            return { message: 'Usuario actualizado', user: rows[0] };
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            throw new Error('Error al actualizar el usuario');
        }
    }
    /*
    Metodo para encontrar usuarios de acuerdo a su rut, este metodo esta probado y funciona
    @param {rut}: rut del usuario a buscar
    @return{Object}: objeto con los datos del usuario encontrado
    */
    static async getUserByRut(rut)
    {
        const query = `SELECT * FROM usuarios WHERE rut = $1`;
        const params = [rut];
        try {
            const {rows} = await poolDatabase.query(query, params);
            if (rows.length === 0) {
                return {message:'Usuario no encontrado',
                    user: false,
                }; // Usuario no encontrado
            }
            return rows[0]; // Retorna el usuario encontrado
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            throw new Error('Error al obtener el usuario', error.message);
        }
    }

}