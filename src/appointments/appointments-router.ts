import {Router} from "express";
import {AppointmentsController} from "./appointments-controller.js";
import {authenticate} from "../shared/middleware/authenticate.js";
import {authorize} from "../shared/middleware/authorize.js";
import {Role} from "../shared/roles.js";

export function createAppointmentsRouter(appointmentsController: AppointmentsController) {

    const router = Router();

    router.get('/:id', authenticate, authorize([Role.ADMIN, Role.DOCTOR, Role.PATIENT]), appointmentsController.getById)
    router.get('/', authenticate, authorize([Role.ADMIN, Role.DOCTOR, Role.PATIENT]), appointmentsController.getAll)

    router.put('/', authenticate, authorize([Role.ADMIN, Role.DOCTOR, Role.PATIENT]), appointmentsController.create)

// @ts-ignore
    router.patch('/:id', authenticate, authorize([Role.ADMIN, Role.DOCTOR, Role.PATIENT]), appointmentsController.update)
// @ts-ignore
    router.delete('/:id', authenticate, authorize([Role.ADMIN, Role.DOCTOR, Role.PATIENT]), appointmentsController.remove)

    return router;
}