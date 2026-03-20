import express from "express";
import {Enrutador} from "./routes/contactoRoutes.js";
import {Contacto} from "./models/Contacto.js";
import {CreadorUsuarios} from "./routes/usuariosRoutes.js"
import {Usuario} from "./models/Usuario.js"
import {auth} from "./middlewares/auth.js";

const app = express();

app.use(express.json());

const PORT = 1234;

app.use("/contactos", auth, Enrutador(Contacto));
app.use("/usuarios", CreadorUsuarios(Usuario));

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});