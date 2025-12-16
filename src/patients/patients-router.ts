import {Router} from 'express';
import {PatientsController} from "./patients-controller.js";
import {validateRequest} from "../shared/middleware/validate-request.js";
import {patientIdSchema, searchPatientSchema, updatePatientSchema} from "./validation.js";
import {authenticate} from "../shared/middleware/authenticate.js";
import {authorize} from "../shared/middleware/authorize.js";
import {Role} from "../shared/roles.js";

export function createPatientsRouter(patientsController: PatientsController) {
    const router = Router();

    router.get('/me',
        validateRequest(patientIdSchema, 'params'),
        authenticate,
        authorize([Role.PATIENT]),
        patientsController.getMe
    )

    router.get('/:id',
        validateRequest(patientIdSchema, 'params'),
        authenticate,
        authorize([Role.DOCTOR, Role.ADMIN]),
        patientsController.getById
    )

    router.get('/',
        validateRequest(searchPatientSchema, 'query'),
        authenticate,
        authorize([Role.ADMIN, Role.DOCTOR]),
        patientsController.getAll
    )

    router.patch('/me',
        validateRequest(patientIdSchema, 'params'),
        validateRequest(updatePatientSchema, 'body'),
        authenticate,
        authorize([Role.PATIENT]),
        patientsController.updateMe
    )

    router.patch('/:id',
        validateRequest(patientIdSchema, 'params'),
        validateRequest(updatePatientSchema, 'body'),
        authenticate,
        authorize([Role.ADMIN]),
        patientsController.updateById
    )

    router.delete('/me',
        validateRequest(patientIdSchema, 'params'),
        authenticate,
        authorize([Role.PATIENT]),
        patientsController.deleteMe
    )

    router.delete('/:id',
        validateRequest(patientIdSchema, 'params'),
        authenticate,
        authorize([Role.PATIENT]),
        patientsController.deleteById
    )

    router.get('/me/appointments',
        authenticate,
        authorize([Role.PATIENT]),
        patientsController.getAppointments
    )

    return router;

}