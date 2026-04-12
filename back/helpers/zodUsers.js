import zod from 'zod'

const usuarioSchema=zod.object({
    nick:zod.string().min(1),
    password:zod.string().min(1),
    mail:zod.string().min(1),
    rol:zod.enum(["admin", "usuario"]).optional()
})

export const validarUsuario=(usuario)=>{
    return usuarioSchema.safeParse(usuario)
}