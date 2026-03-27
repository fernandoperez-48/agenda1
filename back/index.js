import express from "express";
import {Enrutador} from "./routes/contactoRoutes.js";
import {ContactoModel} from "./models/Contacto_MDB.js";
import {CreadorUsuarios} from "./routes/usuariosRoutes.js"
import {UsuarioModel} from "./models/Usuario_MDB.js"
import {auth} from "./middlewares/auth.js";
import { conexion } from "./helpers/conexion.js";

const app = express();


app.use(express.json());

const PORT = 1234;

app.use("/contactos", auth, Enrutador(ContactoModel));
app.use("/usuarios", CreadorUsuarios(UsuarioModel));

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});