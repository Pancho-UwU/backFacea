import {dynamoDBDoc,dynamoDB} from './Database.js';
import faker from 'faker';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { tr } from 'faker/lib/locales.js';

const generarUsuarios = async () => {
    const usuarios = [];
    for (let i = 0; i < 10; i++) { // Genera 10 usuarios
        usuarios.push({
            id: uuidv4(),
            rut: `${faker.datatype.number({ min: 10000000, max: 99999999 })}-${faker.datatype.number({ min: 0, max: 9 })}`,
            nombre: faker.name.findName(),
            correo: `${faker.internet.userName()}@alumnos.ucn.cl`,
            generacion: faker.datatype.number({ min: 2010, max: 2024 }),
            carrera: faker.random.arrayElement(['ICCI', 'otra carrera', 'Contador auditor', 'Ingeniería comercial']),
        });
    }
    return usuarios;
};

const generarAdmins = async () => {
    return [{
        id: '1',
        usuario: 'admin1',
        contrasenia: 'admin123',
        carrera: 'Administración',
        nombre: 'Admin 1',
        generacion: '2020',
    }];
};
const generateSuperAdmin = async () => {
    const passwordHash = await bcrypt.hash('superAdmin123', 10); // Hash the password

    return [{
        id: '1',
        usuario: 'superadmin1',
        contrasenia: passwordHash,
        nombre: 'Super Admin 1',
    }];
}
const isTablaVacia = async (tableName) => {
    const params = {
        TableName: tableName,
        Limit: 1,
    };
    try {
        const data = await dynamoDB.scan(params).promise();
        return data.Items.length === 0; // Retorna true si la tabla está vacía
    }
    catch (error) { 
        console.log(`Error al verificar la tabla ${tableName}:`, error);
        return false; // Si hay error, asumimos que no está vacía   
    }
};
const insertarEnTabla = async (tableName, items) => {
    // Si items es un objeto único, lo convertimos en array
    const itemsArray = Array.isArray(items) ? items : [items];
    
    for (const item of itemsArray) {
        const params = {
            TableName: tableName,
            Item: item,
        };
        
        try {
            await dynamoDBDoc.put(params).promise();
            console.log(`${tableName} insertado:`, item);
        } catch (error) {
            console.error(`Error al insertar en ${tableName}:`, error);
            throw error;  // Propagamos el error
        }
    }
};



// Función principal para generar y agregar datos
const generarSeeder = async () => {
    try{
        const [usuariosVacia, adminsVacia,superAdminVacia] = await Promise.all([
            isTablaVacia('usuarios'),
            isTablaVacia('admins'),
            isTablaVacia('superAdmins')
        ]);
        const promesas = [];
        if(usuariosVacia){
            const usuarios = await generarUsuarios();
            promesas.push(insertarEnTabla('usuarios', usuarios));
        }else{
            console.log('error: la tabla usuarios no está vacía');
        }
        if(adminsVacia){
            const admins = await generarAdmins();
            promesas.push(insertarEnTabla('admins', admins));   
        }else{
            console.log('error: la tabla admins no está vacía');
        }
        if(superAdminVacia){
            const superAdmin = await generateSuperAdmin();
            promesas.push(insertarEnTabla('superAdmins', superAdmin));
        }else{
            console.log('error: la tabla superAdmins no está vacía');
        }
        await Promise.all(promesas);
    }catch(error){
        console.error('Error al generar el seeder:', error);
        throw error; // Propagamos el error
    }
};

export const seeder = async () => {
    try {
        await generarSeeder();
        console.log('Datos insertados correctamente');
    } catch (error) {
        console.error('Error al insertar datos:', error);
    }
};
