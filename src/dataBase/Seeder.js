import client from './Database.js';
import faker from 'faker';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { ScanCommand,CreateTableCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';


const generarUsuarios = async () => {
    const usuarios = [];
    for (let i = 0; i < 10; i++) { // Genera 10 usuarios
        usuarios.push({
            id: uuidv4(),
            rut: `${faker.datatype.number({ min: 10000000, max: 99999999 })}-${faker.datatype.number({ min: 0, max: 9 })}`,
            nombre: faker.name.findName(),
            carrera: faker.random.arrayElement(['Ingeniería en Información y Control de Gestión', 'Contador auditor', 'Ingeniería comercial']),
            isActive: "1",
        });
    }
    return usuarios;
};
const generarAdmins = async () => {
    const passwordHash = await bcrypt.hash('admin123', 10); // Hash the password
    return [{
        id: '1',
        usuario: 'admin1',
        contrasenia: passwordHash,
        nombre: 'Admin 1',
    }];
};
const createTableSiNoExiste = async (tableName) => {
    try{
        await client.send(new DescribeTableCommand({ TableName: tableName }));

    }
    catch(err)
    {
        if(err.name="ResourceNotFoundException")
            {
                const params = {
                    TableName: tableName,
                    KeySchema: [
                        { AttributeName: 'id', KeyType: 'HASH' }, // Partition key
                    ],
                    AttributeDefinitions: [
                        { AttributeName: 'id', AttributeType: 'S' },
                    ],
                    BillingMode: 'PAY_PER_REQUEST',
                };
                await client.send(new CreateTableCommand(params));
                console.log(`Tabla ${tableName} creada`);

            }
            else
            {
                console.error('Error al crear la tabla:', err);
            }
        
    }
}
const isTablaVacia = async (tableName) => {
    try{
        await createTableSiNoExiste(tableName);
        const params={
            TableName: tableName,
            Limit:1,
        }
        const data = await client.send(new ScanCommand(params));
        return data.Items.length === 0; // Si no hay items, la tabla está vacía
    }
    catch(err)
    {
        console.error('Error al verificar si la tabla está vacía:');
        return false;
    }
};
const insertarEnTabla = async (tableName, items) => {
    // Si items es un objeto único, lo convertimos en array
    const itemsArray = Array.isArray(items) ? items : [items];
    if(tableName === "usuarios")
        {
            for (const item of itemsArray) {
                const params = {
                    TableName: tableName,
                    Item: 
                        {
                            'id': { S: item.id },  // Asegúrate de que el tipo es 'S' (String)
                            'rut': { S: item.rut },  // 'rut' como cadena
                            'nombre': { S: item.nombre },  // 'nombre' como cadena
                            'carrera': { S: item.carrera },  // 'carrera' como cadena
                            'isActive': { N: item.isActive },  // 'isActive' como número (debe ser un string)
                        }
                    }
                    try {
                        await client.send(new PutItemCommand(params));
                        console.log(`Usuario con ID ${item.id} insertado correctamente`);
                    } catch (error) {
                        console.error("Error al insertar el usuario con", error);
                    }
                };
                
            }
    if (tableName === "admins"){
        for(const item of itemsArray){
            const params2={
                TableName: tableName,
                Item:{
                    'id': {S: item.id},
                    'usuario': {S: item.usuario},
                    'contrasenia': {S: item.contrasenia},
                    'nombre': {S: item.nombre}
                }
            }
            try{
                await client.send(new PutItemCommand(params2))
                console.log("Datos insertados")
            }catch(err){
                console.error("error al insertar datos")
            }
        }
    }
            
    
};
// Función principal para generar y agregar datos
const generarSeeder = async () => {
    try{
        const [usuariosVacia, adminsVacia] = await Promise.all([
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
            console.log({message:"hola"})
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
