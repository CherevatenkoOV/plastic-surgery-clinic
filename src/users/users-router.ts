import express, {Router} from "express";
import {
    getAll,
    getById,
    remove,
    update,
} from "./users-controller.js";
import {authenticate} from "../shared/middleware/authenticate.js";
import {authorize} from "../shared/middleware/authorize.js";
import {Role} from "../shared/roles.js";

const router: Router = express.Router();

router.get('/', authenticate, authorize(Role.ADMIN), getAll)
router.get('/:id', authenticate, authorize(Role.ADMIN), getById)

router.patch('/:id', authenticate, authorize(Role.ADMIN), update)

router.delete('/:id', authenticate, authorize(Role.ADMIN), remove)

export default router;