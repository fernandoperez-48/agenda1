import {Router} from 'express';
import {ContactoController} from '../controllers/contactoController.js';

export const contactoRoutes=Router();

contactoRoutes.get("/", ContactoController.getAll);

contactoRoutes.get("/:id", ContactoController.getById);

contactoRoutes.delete("/:id", ContactoController.delete);

contactoRoutes.post("/", ContactoController.create);

contactoRoutes.put("/:id", ContactoController.update);

   