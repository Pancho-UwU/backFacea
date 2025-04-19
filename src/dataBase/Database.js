import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import dotenv from 'dotenv';
dotenv.config();
// Configurar DynamoDB Local

const client = new DynamoDBClient({
  region: "sa-east-1", // Asegurate que sea la región correcta
  credentials: {
    accessKeyId: process.env.DYNAMODB_USER,       // ✅ Tus claves reales
    secretAccessKey: process.env.DYNAMODB_PASSWORD, // ✅ Tus claves reales
  },
});

  

export default client;
