import {usuarios} from "../datos/usuarios.js"
import bcrypt from "bcrypt"


let usuariosDevolver=usuarios

export class Usuario{

    static getAll() {
        return usuariosDevolver;
    }

    static register=async(usuario)=>{  //cuando encriptamos convertimos en asincrono

        if(!usuario.success)
        {
            return Error
        }

        const nuevoUsuario={
            ...usuario.data
        }
        if(usuariosDevolver.find(usuario=>usuario.nick===nuevoUsuario.nick) || usuariosDevolver.find(usuario=>usuario.mail===nuevoUsuario.mail))
        {
            return "usuario duplicado"
        }

        nuevoUsuario.password=await bcrypt.hash(nuevoUsuario.password,10)

        usuariosDevolver=[...usuariosDevolver,nuevoUsuario]
        return nuevoUsuario
    }

    static login=async(usuario)=>{

       let usuarioRecibido=usuario;

       let usuarioRegistrado=usuariosDevolver.find(usuario=>usuario.nick===usuarioRecibido.nick)

         if(!usuarioRegistrado)
            {
                return "Usuario no encontrado"
            }
        
        let pwd = await bcrypt.compare(usuarioRecibido.password,usuarioRegistrado.password)

        if(!pwd)
        {
            return "Fallo autenticacion"
        }

        const usuarioFormateado={
            nick:usuarioRegistrado.nick,
            mail:usuarioRegistrado.mail,
            token:"token"
        }
        return usuarioFormateado

    }

    
}

