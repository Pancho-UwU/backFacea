import z from 'zod'

const adminSchema = z.object({
    usuario: z.string({ required_error: "El usuario es requerido"}).min(3, {message: "El usuario debe tener al menos 3 caracteres"}).max(55, {message: "El usuario debe tener menos de 50 caracteres"}),
    contrasenia: z.string({ required_error: "La contraseña es requerida"}).min(3, {message: "La contraseña debe tener al menos 3 caracteres"}).max(55, {message: "La contraseña debe tener menos de 50 caracteres"}),
    nombre: z.string({ required_error: "El nombre es requerido"}).min(3, {message: "El nombre debe tener al menos 3 caracteres"}).max(55, {message: "El nombre debe tener menos de 50 caracteres"}),
})
export function validateAdminLogin(object){
    return adminSchema.safeParse(object)
}
export function validateAdminParse(object){
    return adminSchema.partial().safeParse(object)
}
