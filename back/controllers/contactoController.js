import { Contacto } from '../models/contacto.js';
import { validarContacto, validarParcial } from '../helpers/zod.js';

export class ContactoController {

    static async getAll(req, res) {
        res.json(await Contacto.getAll());
    }

    static async getById(req, res) {
        const id = Number(req.params.id);
        const contacto = await Contacto.getById(id);
        if (contacto) {
            res.json(contacto);
        } else {
            res.status(400).end();
        }   
    }

    static async delete(req, res) {
        const id = Number(req.params.id);
        const listaContactos = await Contacto.delete(id);
        if (listaContactos) {
            res.json(listaContactos);
        } else {
            res.status(400).end();
        }
    }

    static async create(req, res) {
        const contacto = validarContacto(req.body);

        if (contacto.error) {
            return res.status(400).json('validacion incorrecta');
        }

        const nuevoContacto = await Contacto.create(contacto);
        res.json(nuevoContacto);
    }

    static async update(req, res) {
        const id = Number(req.params.id);
        const contactoValido = validarParcial(req.body);

        const nuevoContacto = await Contacto.update(id, contactoValido);
        res.json(nuevoContacto);
    }
}