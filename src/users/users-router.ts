import express, {Router} from "express";
import {getAll, getById, create, remove, update} from "./users.controller.js";

const router: Router = express.Router();

router.get('/', getAll)

router.get('/:id', getById)

router.put('/register', create)

router.patch('/:id', update)

router.delete('/:id', remove)

export default router;