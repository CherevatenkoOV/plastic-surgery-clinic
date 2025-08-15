import express, {Router} from "express";
import {getAll, getById, login, register, remove, changePassword, update} from "./users-controller.js";
import {checkAuthentification} from "../shared/middleware/checkAuthentification.js";

const router: Router = express.Router();

router.get('/', getAll)
router.get('/:id', getById)

router.post('/register', register)
router.post('/login', login)

router.patch('/change-password', checkAuthentification, changePassword)
router.patch('/:id', update)

router.delete('/:id', remove)

export default router;