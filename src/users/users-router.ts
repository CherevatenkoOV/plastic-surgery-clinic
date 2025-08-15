import express, {Router} from "express";
import {getAll, getById, login, register, remove, update} from "./users-controller.js";

const router: Router = express.Router();

router.get('/', getAll)

router.get('/:id', getById)

router.post('/register', register)

router.patch('/:id', update)

router.post('/login', login)

router.delete('/:id', remove)

export default router;