import cors from 'cors'
export const corsMiddleware= ()=>cors({
    origin:(origin,callback)=>{
        const ACCEPTED_ORIGINS = [
            'http://localhost:8080',
            'http://localhost:3000',
            'http://localhost:4200',
            'http://192.168.7.43:4200',
            'https://tarjetafacea.cl', // Asegúrate de incluir "https://" si tu dominio lo usa
            'https://dpo5l9etbbt61.cloudfront.net',
            'https://acfhlg320d.execute-api.sa-east-1.amazonaws.com',
            'http://frontendfaceaversionfinal.s3-website-sa-east-1.amazonaws.com'
        ]
        if(ACCEPTED_ORIGINS.includes(origin)){
            return callback(null,origin)
        }
        if(!origin)
            {
                return callback(null,'*')
            }
        return callback(new Error('Not allowed by CORS'))
    },
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Amz-Date', 'X-Api-Key', 'X-Amz-Security-Token']

})