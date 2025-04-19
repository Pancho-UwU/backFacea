import z from 'zod'
const userSchemaCreate = z.object({
    rut: z.string({ required_error: "El rut es requerido"}).regex(/\d{1,2}\d{3}\d{3}-[0-9kK]{1}/,{message: "El rut no es valido"}),
    nombre: z.string({invalid_type_error: "El nombre debe ser letras", required_error: "El nombre es requerido"}).min(3, {message: "El nombre debe tener al menos 3 caracteres"}).max(55, {message: "El nombre debe tener menos de 50 caracteres"}),
    carrera: z.enum(['Ingeniería en Control de Gestión', 'Contador auditor', 'Ingeniería comercial'],{ required_error: "La carrera es requerida" }),
})
const userValidate2User = z.object({
    rutB: z.string({ required_error: "El rut es requerido"}).regex(/\d{1,2}\d{3}\d{3}-[0-9kK]{1}/,{message: "El rut no es valido"}),
    nombre: z.string({invalid_type_error: "El nombre debe ser letras", required_error: "El nombre es requerido"}).min(3, {message: "El nombre debe tener al menos 3 caracteres"}).max(55, {message: "El nombre debe tener menos de 50 caracteres"}),
    carrera: z.enum(['Ingeniería en Control de Gestión', 'Contador auditor', 'Ingeniería comercial'],{ required_error: "La carrera es requerida" }),
})


export function validateUserCreate(object){
    return userSchemaCreate.safeParse(object)
}
export function validatePartialUserCreate(object){
    return userSchemaCreate.partial().safeParse(object)
}
export function validateUserUpdate(object){
    return userValidate2User.safeParse(object)
}
export function validatePartialUserUpdate(object){
    return userValidate2User.partial().safeParse(object)
}

