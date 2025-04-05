import AWS from "aws-sdk";

// Configurar DynamoDB Local
const dynamoDB = new AWS.DynamoDB({
    region: "us-east-1",
    endpoint: "http://localhost:8000",
    accessKeyId: "fakeMyKeyId",
    secretAccessKey: "fakeSecretAccessKey",
  });
  const dynamoDBDoc = new AWS.DynamoDB.DocumentClient({
    region: "us-east-1",
    endpoint: "http://localhost:8000",
    accessKeyId: "fakeMyKeyId",
    secretAccessKey: "fakeSecretAccessKey",
  });

  const crearTablas = async () => {
    try{
        const params = {
            TableName: "usuarios",
            KeySchema: [
                { AttributeName: "id", KeyType: "HASH" }, // Partition key
            ],
            AttributeDefinitions: [
                { AttributeName: "id", AttributeType: "S" },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
        };
        await dynamoDB.createTable(params).promise();
        console.log("Tabla creada exitosamente:", params.TableName);
      }
    
   
     catch (error) {
    console.error("Error creando tabla:", error);
  }
  };
  const creartTablaSuperAdmin = async () => {
    try{
      const params= {
        TableName: "superAdmins",
        KeySchema: [
          { AttributeName: "id", KeyType: "HASH" }, // Partition key
        ],
        AttributeDefinitions: [
          { AttributeName: "id", AttributeType: "S" },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      };
      await dynamoDB.createTable(params).promise();
      console.log("Tabla creada exitosamente:", params.TableName);
    } catch (error) { 
      console.error("Error creando tabla:", error);
    }
  }
  const crearTablaAdmin = async () => {
    try {
        const params = {
            TableName: "admins",
            KeySchema: [
              { AttributeName: "id", KeyType: "HASH" }, // Partition key
            ],
            AttributeDefinitions: [
              { AttributeName: "id", AttributeType: "S" },
            ],
            ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5,
            },
          };
        await dynamoDB.createTable(params).promise();
        console.log("Tabla Admin creada exitosamente:", params.TableName);
    } catch (error) {
        console.error("Error creando tabla Admin:", error);
    }
  }
  // Verificar si la tabla existe y crearla si no existe
  const verificarTablas = async () => {
  try {
    // Verificar si la tabla 'usuarios' existe
    const paramsUsuarios = { TableName: "usuarios" };
    await dynamoDB.describeTable(paramsUsuarios).promise(); // Usamos .get() de DocumentClient
    console.log("La tabla 'usuarios' ya existe.");

    // Verificar si la tabla 'admins' existe
    const paramsAdmin = { TableName: "admins" };
    await dynamoDB.describeTable(paramsAdmin).promise(); // Usamos .get() de DocumentClient
    console.log("La tabla 'admins' ya existe.");
    const paramsSuperAdmin = { TableName: "superAdmins" };
    await dynamoDB.describeTable(paramsSuperAdmin).promise(); // Usamos .get() de DocumentClient
    console.log("La tabla 'superAdmins' ya existe.");
  } catch (error) {
    if (error.code === "ResourceNotFoundException") {
      console.log("Una o ambas tablas no existen, creándolas...");
      await crearTablas();
      await crearTablaAdmin();
      await creartTablaSuperAdmin();
    } else {
      console.error("Error verificando las tablas:", error);
    }
  }
};


const delteTable = async () => {
    const params = {
        TableName: "admins",
    };
    try {
        await dynamoDB.deleteTable(params).promise();
        console.log("Tabla eliminada exitosamente.");
    } catch (error) {
        console.error("Error eliminando la tabla:", error);
    }
}
verificarTablas();

export {dynamoDB, dynamoDBDoc};
