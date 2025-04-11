import cors from 'cors'
export const corsMiddleware= ()=>cors({
    origin:(origin,callback)=>{
        console.log(origin);
        console.log(callback);
        const ACCEPTED_ORIGINS = [
            'http://localhost:8080',
            'http://localhost:3000',
            'http://localhost:4200'
        ]
        if(ACCEPTED_ORIGINS.includes(origin)){
            return callback(null,true)
        }
        if(!origin)
            {
                return callback(null,true)
            }
        return callback(new error('Not allowed by CORS'))
    }
})