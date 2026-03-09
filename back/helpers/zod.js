import zod from 'zod'

const contactosSchema= zod.object({
    id:zod.number(),
    nombre:zod.string(),
    apellido:zod.string(),
    empresa:zod.string().optional(),
    email:zod.string(),
    domicilio:zod.string().optional(),
    telefono:zod.string().optional()

})

export const validarContacto = (contacto) => {
   return contactosSchema.safeParse(contacto)

}

export const validarParcial= (contacto) => {
    return contactosSchema.partial().safeParse(contacto)
   
}