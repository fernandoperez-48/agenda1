import { contactos } from "./datos/contactos.js";
import express from "express";

const app = express();

app.use(express.json());

const PORT = 1234;

let listaContactos = contactos;

app.get("/", (req, res) => {
    res.json(listaContactos);
});

app.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const contacto = listaContactos.find(c => c.id === id);
    if (contacto) {
        res.json(contacto);
    } else {
        res.status(404).json({ error: "Contacto no encontrado" });
    }
});

app.delete("/:id", (req, res) => {
   const id=Number(req.params.id);
   listaContactos=listaContactos.filter(c=>c.id!==id);
   if(listaContactos){
    res.json(listaContactos);
   } else{
    res.status(404).end();
   }
});

app.post("/", (req, res) => {
    const contacto=req.body;
    const nuevoContacto={
        id:contacto.id,
        nombre:contacto.nombre,
        apellido:contacto.apellido,
        email:contacto.email,
        empresa:contacto.empresa,
        domicilio:contacto.domicilio,
        telefono:contacto.telefono
    };
    listaContactos=[...listaContactos,nuevoContacto];
    res.json(nuevoContacto);
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});