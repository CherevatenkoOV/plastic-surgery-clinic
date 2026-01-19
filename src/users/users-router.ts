import {Router} from "express";
import {
    UsersController,
} from "./users-controller.js";
import {authenticate} from "../shared/middleware/authenticate.js";
import {authorize} from "../shared/middleware/authorize.js";
import {Role} from "../shared/roles.js";

export function createUsersRouter (usersController: UsersController) {
    const router = Router();

    router.get('/', authenticate, authorize([Role.ADMIN]), usersController.getAll)
    router.get('/:id', authenticate, authorize([Role.ADMIN]), usersController.getById)

    router.get('/by-email', authenticate, authorize([Role.ADMIN]), usersController.getByEmail)

    router.patch('/:id', authenticate, authorize([Role.ADMIN]), usersController.update)

    router.delete('/:id', authenticate, authorize([Role.ADMIN]), usersController.delete)

    return router;
}


