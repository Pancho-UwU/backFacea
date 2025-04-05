import { dynamoDBDoc } from "../dataBase/Database.js";

export class userModel
{
    static async getUser({rut})
    {

        const params={
            TableName:'usuarios',
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

    static async getUserFilter({ rut, generacion, carrera }) {
        const params = {
            TableName: 'usuarios',
        };
    
        const filterExpressions = [];
        const expressionAttributeValues = {};
    
        if (rut) {
            filterExpressions.push('rut = :rut');
            expressionAttributeValues[':rut'] = rut;
        }
    
        if (generacion) {
            filterExpressions.push('generacion = :generacion');
            expressionAttributeValues[':generacion'] = typeof generacion === 'string' ? 
            parseInt(generacion, 10) : generacion;
        }
    
        if (carrera) {
            filterExpressions.push('carrera = :carrera');
            expressionAttributeValues[':carrera'] = carrera;
        }
    
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
    
    
    
    
    static async getAllUsers()
    {
        const params={
            TableName:'usuarios',
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