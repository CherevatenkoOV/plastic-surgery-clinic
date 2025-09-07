import express, {Router} from "express";
import {
    getAll,
    getById,
    login,
    register,
    remove,
    changePassword,
    update,
    requestResetPassword, resetPassword, logout
} from "./users-controller.js";
import {authenticate} from "../shared/middleware/authenticate.js";
import {authorize} from "../shared/middleware/authorize.js";
import {Role} from "../shared/roles.js";

const router: Router = express.Router();

router.get('/', authenticate, authorize(Role.ADMIN), getAll)
router.get('/:id', authenticate, authorize(Role.ADMIN), getById)

router.post('/register', register)
router.post('/login', login)
router.post('/logout', authenticate, authorize(Role.ADMIN), logout)
router.post('/request-reset-password', authenticate, authorize(Role.ADMIN), requestResetPassword)

router.patch('/change-password', authenticate, authorize(Role.ADMIN), changePassword)
router.patch('/reset-password', resetPassword)
router.patch('/:id', authenticate, authorize(Role.ADMIN), update)

router.delete('/:id', authenticate, authorize(Role.ADMIN), remove)

export default router;