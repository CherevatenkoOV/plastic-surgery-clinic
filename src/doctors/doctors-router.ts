import {Router} from 'express';
import {
    DoctorsController
} from "./doctors-controller.js";
import {validateRequest} from "../shared/middleware/validate-request.js";
import {doctorIdSchema, searchDoctorSchema, updateDoctorSchema} from "./validation.js";
import {authorize} from "../shared/middleware/authorize.js";
import {Role} from "../shared/roles.js";
import {authenticate} from "../shared/middleware/authenticate.js";

export function createDoctorsRouter(doctorsController: DoctorsController) {
    const router = Router();

    router.get('/me',
        validateRequest(doctorIdSchema, 'params'),
        authenticate,
        authorize([Role.DOCTOR]),
        doctorsController.getMe
    )

    router.get('/:id',
        authenticate,
        authorize([Role.PATIENT, Role.ADMIN]),
        doctorsController.getById
    )

    router.get('/',
        validateRequest(searchDoctorSchema, 'query'),
        authenticate,
        authorize([Role.ADMIN, Role.PATIENT]),
        doctorsController.getAll
    )

    router.patch('/me',
        validateRequest(doctorIdSchema, 'params'),
        validateRequest(updateDoctorSchema, 'body'),
        authenticate,
        authorize([Role.DOCTOR]),
        doctorsController.updateMe
    )

    router.patch('/:id',
        validateRequest(doctorIdSchema, 'params'),
        validateRequest(updateDoctorSchema, 'body'),
        authenticate,
        authorize([Role.DOCTOR]),
        doctorsController.updateById
    )

    router.delete('/me',
        validateRequest(doctorIdSchema, 'params'),
        authenticate,
        authorize([Role.DOCTOR]),
        doctorsController.deleteMe
    )


    router.delete('/:id',
        validateRequest(doctorIdSchema, 'params'),
        authenticate,
        authorize([Role.ADMIN]),
        doctorsController.deleteById
    )

    router.get('/me/appointments',
        authenticate,
        authorize([Role.DOCTOR]),
        doctorsController.getAppointments
    )

    router.post('/invite',
        authenticate,
        authorize([Role.ADMIN]),
        doctorsController.inviteDoctor
    )

    return router;
}

