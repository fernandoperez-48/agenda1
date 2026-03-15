import { validarUsuario } from "../helpers/zodUsers.js";

export class UsuarioController{
    constructor(modelo){
        this.modelo=modelo
    }

     getAll = async (req, res) =>   {
        res.json(await this.modelo.getAll());
    }

    register=async(req,res)=>{
        const usuario=validarUsuario(req.body)
       
        const nuevoUsuario=await this.modelo.register(usuario)  

        if(nuevoUsuario == Error){
            return res.status(400).json("Error de validacion")
        }
        res.json(nuevoUsuario)
    }

}