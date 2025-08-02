import express, {Router} from "express";
import {remove, getAll, create, update, getById} from "./appointments-controller.js";

const router: Router = express.Router();

router.get('/', getAll)

router.get('/:id', getById)

router.put('/', create)

router.patch('/:id', update)

router.delete('/:id', remove)

export default router;