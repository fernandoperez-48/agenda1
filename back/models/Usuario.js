import {usuarios} from "../datos/usuarios.js"


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

        usuariosDevolver=[...usuariosDevolver,nuevoUsuario]
        return nuevoUsuario
    }

   
}

