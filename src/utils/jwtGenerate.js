import  jsonwebtoken  from "jsonwebtoken";


export const jwtGenerate = (user) => {
    return jsonwebtoken.sign({
        id:user.id,
        username:user.usuario,
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXPIRES_IN
    }           
    );
};