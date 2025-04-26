import cors from 'cors'
export const corsMiddleware= ()=>cors({
    origin:(origin,callback)=>{
        const ACCEPTED_ORIGINS = [
            'http://localhost:8080',
            'http://localhost:3000',
            'http://localhost:4200',
            'http://192.168.7.43:4200'
        ]
        if(ACCEPTED_ORIGINS.includes(origin)){
            return callback(null,true)
        }
        if(!origin)
            {
                return callback(null,true)
            }
        return callback(new Error('Not allowed by CORS'))
    },
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})