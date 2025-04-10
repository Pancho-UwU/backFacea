import { poolDatabase } from '../dataBase/Database.js';
import faker from 'faker';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const createUser = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            rut VARCHAR(255) NOT NULL UNIQUE,
            carrera VARCHAR(255) NOT NULL,
            isActive INTEGER NOT NULL DEFAULT 1
        );
    `;

    try {
        await poolDatabase.query(query); // Asegúrate de tener un pool de conexión configurado
        console.log("Tabla 'usuarios' creada correctamente (si no existía).");
    } catch (error) {
        console.error("Error al crear la tabla:", error);
    }
};
const createAdmin = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS admins (
            id SERIAL PRIMARY KEY,
            usuario VARCHAR(255) NOT NULL UNIQUE,
            contrasenia VARCHAR(255) NOT NULL,
            nombre VARCHAR(255) NOT NULL
        );
    `;
    try {
        await poolDatabase.query(query); // Asegúrate de tener un pool de conexión configurado
        console.log("Tabla 'admins' creada correctamente (si no existía).");
    }
    catch (error) { 
        console.error("Error al crear la tabla:", error);
    }
};

const generarUsuarios = async () => {
    const usuarios = [];
    
    for (let i = 0; i < 10; i++) { // Genera 10 usuarios
        const nombre = faker.name.findName() // Hash the password
        const rut = `${faker.random.number({ min: 10000000, max: 99999999 })}-${faker.random.arrayElement(['1', '2', '3','4','5','6','7','8','9','K'])}`; 
        const carrera = faker.random.arrayElement(['Contador Auditor', 'Ingeniería en Control de Gestión', 'Ingeniería Comercia']);
        const isActive= 1;
        usuarios.push({
            nombre: nombre,
            rut,
            carrera,
            isActive
        });        
    }
    return usuarios;
};
//verificar si la tabla existe y crearla si no existe
const verificarTabla = async () => {
    const query = `
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables 
            WHERE table_name = 'usuarios'
        );
    `;
    try {
        const result = await poolDatabase.query(query);
        return result.rows[0].exists;
    } catch (error) {
        console.error('Error al verificar la tabla usuarios:', error);
        return false;
    }
}
const verificarTablaAdmin = async () => {
    const query = `
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables 
            WHERE table_name = 'admins'
        );
    `;
    try {
        const result = await poolDatabase.query(query);
        return result.rows[0].exists;
    }
    catch (error) {
        console.error('Error al verificar la tabla admins:', error);
        return false;
    }
}


const generarAdmins = async () => {
    const passwordHash = await bcrypt.hash('admin123', 10); // Hash the password
    return [{
        usuario: 'admin1',
        contrasenia: passwordHash,
        nombre: 'Admin 1',
    }];
};
const isTablaVacia = async (tableName) => {
    const query = `SELECT COUNT(*) FROM ${tableName}`;
    try {
        const data = await poolDatabase.query(query)
        const count = data.rows[0].count; // Cambia esto según el formato de tu respuesta
        return count === '0'; // Verifica si el conteo es cero
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
        // Obtener las columnas y los valores
        const columns = Object.keys(item).join(', ');
        const values = Object.values(item);
        
        // Crear los placeholders numerados para PostgreSQL ($1, $2, etc.)
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
        
        // Crear la consulta con parámetros numerados
        const query = `INSERT INTO "${tableName}" (${columns}) VALUES (${placeholders})`;
        
        try {
            // Ejecutar la consulta pasando los valores como parámetros
            await poolDatabase.query(query, values);
            console.log(`Datos insertados correctamente en ${tableName}`);
        } catch (error) {
            console.error(`Error al insertar datos en ${tableName}:`, error);
        }
    }
};


// Función principal para generar y agregar datos
const generarSeeder = async () => {
    try{
        if(!(await verificarTabla())){
            await createUser();
        }
        if(!(await verificarTablaAdmin())){
            await createAdmin();
        }
        const [usuariosVacia, adminsVacia,superAdminVacia] = await Promise.all([
            isTablaVacia('usuarios'),
            isTablaVacia('admins'),
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
