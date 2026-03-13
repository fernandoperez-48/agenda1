import express from "express";
import {contactoRoutes} from "./routes/contactoRoutes.js";

const app = express();

app.use(express.json());

const PORT = 1234;

app.use("/", contactoRoutes);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});