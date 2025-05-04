import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({ message: "No token provided" });
    }
    try{
        const decoded = jsonwebtoken .verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error)
    {
        res.status(401).json({ message: "token invalido o expirado" });
    }

};