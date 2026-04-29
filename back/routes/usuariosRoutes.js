import { Router } from "express";
import {UsuarioController} from "../controllers/UsuarioController.js"
import { auth } from "../middlewares/auth.js"

export const CreadorUsuarios = (modelo)=>{

    const controlador = new UsuarioController(modelo)

    const usuarioRouter = Router()

    usuarioRouter.post('/',controlador.register)
    usuarioRouter.post('/login',controlador.login)
    usuarioRouter.put('/:id', auth, controlador.update)

    return usuarioRouter

}