import  jsonwebtoken  from "jsonwebtoken";
import { randomUUID } from "crypto";


export const jwtGenerate = (user) => {
    return jsonwebtoken.sign({
        sub:user.id,
        username:user.usuario,
        jti: randomUUID()
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXPIRES_IN,
        algorithm: 'hs256'
    }           
    );

};
export const jwtGenerateRefresh = (user) => {
    return jsonwebtoken.sign({
        sub:user.id,
        jti: randomUUID()
    },
    process.env.JWT_SECRET_REFRESH,
    {
        expiresIn: process.env.JWT_EXPIRES_REFRESH,
        algorithm: 'hs256'
    }           
    );

}