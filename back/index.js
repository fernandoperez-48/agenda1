import { contactos } from "./datos/contactos.js";
import express from "express";
import { validarContacto, validarParcial } from "./helpers/zod.js";

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
    const contacto=validarContacto(req.body);

    if(contacto.error){
        return res.status(400).json('validacion incorrecta');
    }

    const nuevoContacto={
        ...contacto.data
    }

    listaContactos=[...listaContactos,nuevoContacto];
    res.json(nuevoContacto);
});

app.put("/:id", (req, res) => {
    const id=Number(req.params.id);
    const contactoValido=validarParcial(req.body);

    if(contactoValido.error){
        return res.status(400).json('validacion incorrecta');
    }

    const contactoIndex=listaContactos.findIndex(c=>c.id===id);

    if(contactoIndex===-1){
        return res.status(404).json('Contacto no encontrado');
    }

    const nuevoContacto={
        ...listaContactos[contactoIndex],
        ...contactoValido.data
    }
    listaContactos[contactoIndex]=nuevoContacto;
    res.json(nuevoContacto);
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});