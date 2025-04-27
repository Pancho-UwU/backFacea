import jsonwebtoken from 'jsonwebtoken';
const { TokenExpiredError, JsonWebTokenError } = jsonwebtoken;

export const checkToJWTExpireTime = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err instanceof TokenExpiredError) {

                return res.status(401).json({ message: 'Token has expired' });
            } else if (err instanceof JsonWebTokenError) {

                return res.status(401).json({ message: 'Invalid token' });
            } else {

                return res.status(500).json({ message: 'Internal server error' });
            }
        }

        req.user = decoded.user;
        next();
    });
};
