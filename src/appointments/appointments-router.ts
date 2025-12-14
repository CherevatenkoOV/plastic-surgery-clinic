import express, {Router} from "express";
import {remove, getAll, create, update, getById} from "./appointments-controller.js";
import {authenticate} from "../shared/middleware/authenticate.js";
import {authorize} from "../shared/middleware/authorize.js";
import {Role} from "../shared/roles.js";

const router: Router = express.Router();

router.get('/:id', authenticate, authorize([Role.ADMIN, Role.DOCTOR, Role.PATIENT]), getById)
router.get('/', authenticate, authorize([Role.ADMIN, Role.DOCTOR, Role.PATIENT]), getAll)

router.put('/', authenticate, authorize([Role.ADMIN, Role.DOCTOR, Role.PATIENT]), create)

// @ts-ignore
router.patch('/:id',authenticate, authorize([Role.ADMIN, Role.DOCTOR, Role.PATIENT]), update)
// @ts-ignore
router.delete('/:id', authenticate, authorize([Role.ADMIN, Role.DOCTOR, Role.PATIENT]), remove)

export default router;