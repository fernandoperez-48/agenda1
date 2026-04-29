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

    update = async (req, res) => {
        const { id } = req.params;
        const datos = req.body;

        const usuarioActualizado = await this.modelo.update(id, datos);

        if (!usuarioActualizado) {
            return res.status(404).json("Usuario no encontrado");
        }

        res.json(usuarioActualizado);
    }

    login=async(req,res)=>{
        const datosAuth=req.body

        const usuario=await this.modelo.login(datosAuth)

        if(usuario)
        {
            res.json(usuario)
        }
        else{
            res.status(400).end()
        }
    }

}