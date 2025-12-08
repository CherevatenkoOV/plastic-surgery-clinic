import express, {Router} from "express";
import {
    // create,
    getAll, getByEmail,
    getById,
    remove,
    update,
} from "./users-controller.js";
import {authenticate} from "../shared/middleware/authenticate.js";
import {authorize} from "../shared/middleware/authorize.js";
import {Role} from "../shared/roles.js";
import {getMe} from "../doctors/doctors-controller.js";

const router: Router = express.Router();

router.get('/', authenticate, authorize([Role.ADMIN]), getAll)
router.get('/:id', authenticate, authorize([Role.ADMIN]), getById)
router.get('/me', authenticate, authorize([Role.DOCTOR]), getMe)

router.get('/by-email', authenticate, authorize([Role.ADMIN]), getByEmail)

// router.post('/', authenticate, authorize([Role.ADMIN]), create)

router.patch('/:id', authenticate, authorize([Role.ADMIN]), update)

router.delete('/:id', authenticate, authorize([Role.ADMIN]), remove)

export default router;