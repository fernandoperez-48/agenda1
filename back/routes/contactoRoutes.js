import {Router} from 'express';
import {ContactoController} from '../controllers/contactoController.js';

export const Enrutador=(modelo) => {

const controlador = new ContactoController(modelo);

const contactoRoutes=Router();

contactoRoutes.get("/", controlador.getAll);

contactoRoutes.get("/:id", controlador.getById);

contactoRoutes.delete("/:id", controlador.delete);

contactoRoutes.post("/", controlador.create);

contactoRoutes.put("/:id", controlador.update);

contactoRoutes.patch("/:id/publico", controlador.togglePublico);

contactoRoutes.patch("/:id/visible", controlador.toggleVisible);

return contactoRoutes;
}