import cors from 'cors'
export const corsMiddleware= ()=>cors({
    origin:(origin,callback)=>{
        const ACCEPTED_ORIGINS = [
            'http://localhost:8080',
            'http://localhosto:3000'
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