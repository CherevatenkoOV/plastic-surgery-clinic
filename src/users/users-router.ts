import {Router} from "express";
import {
    UserController,
} from "./users-controller.js";
import {authenticate} from "../shared/middleware/authenticate.js";
import {authorize} from "../shared/middleware/authorize.js";
import {Role} from "../shared/roles.js";

export function createUserRouter (userController: UserController) {
    const router = Router();
    router.get('/', authenticate, authorize([Role.ADMIN]), userController.getAll)
    router.get('/:id', authenticate, authorize([Role.ADMIN]), userController.getById)

    router.get('/by-email', authenticate, authorize([Role.ADMIN]), userController.getByEmail)

// router.post('/', authenticate, authorize([Role.ADMIN]), userController.create)

    router.patch('/:id', authenticate, authorize([Role.ADMIN]), userController.update)

    router.delete('/:id', authenticate, authorize([Role.ADMIN]), userController.remove)

    return router;
}


