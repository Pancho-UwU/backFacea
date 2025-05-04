import jsonwebtoken from 'jsonwebtoken';

export const refreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({ message: "No refresh token provided" });
    }
    try{
        const payload =jsonwebtoken.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
        const newToken = jsonwebtoken.sign({
            sub: payload.sub},
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
                algorithm: 'HS256'
            });
            res.cookie('token',newToken,{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'Strict', 
                maxAge:  60 * 60 * 1000 
            })
            return res.status(200).json({token: newToken, message: "Token de acceso renovado" });
    }
    catch(error){
        res.status(401).json({ message: "Error al renovar el token de acceso", error:error.message });
    }

};
