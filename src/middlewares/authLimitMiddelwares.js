import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs:  15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 100 requests per windowMs
    message: 'Demasiadas solicitudes desde esta dirección IP, por favor intente de nuevo más tarde.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});