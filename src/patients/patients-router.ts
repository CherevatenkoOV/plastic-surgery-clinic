import express, {Router} from 'express';
import {
    getAll, getById, remove, update
} from "./patients-controller.js";
import {validateRequest} from "../shared/middleware/validate-request.js";
import {patientIdSchema, searchPatientSchema, updatePatientSchema} from "./validation.js";
import {authenticate} from "../shared/middleware/authenticate.js";
import {authorize} from "../shared/middleware/authorize.js";
import {Role} from "../shared/roles.js";
import {getAppointments} from "../doctors/doctors-controller.js";

const router: Router = express.Router();

router.get('/',
    validateRequest(searchPatientSchema, 'query'),
    authenticate,
    authorize([Role.ADMIN, Role.DOCTOR]),
    getAll
)

router.get('/me',
    validateRequest(patientIdSchema, 'params'),
    authenticate,
    authorize([Role.PATIENT]),
    getById
)

router.patch('/me',
    validateRequest(patientIdSchema, 'params'),
    validateRequest(updatePatientSchema, 'body'),
    authenticate,
    authorize([Role.PATIENT]),
    update
)

router.delete('/me',
    validateRequest(patientIdSchema, 'params'),
    authenticate,
    authorize([Role.PATIENT]),
    remove
)

router.get('/:id',
    validateRequest(patientIdSchema, 'params'),
    authenticate,
    authorize([Role.ADMIN, Role.DOCTOR]),
    getById
)


router.patch('/:id',
    validateRequest(patientIdSchema, 'params'),
    validateRequest(updatePatientSchema, 'body'),
    authenticate,
    authorize([Role.ADMIN, Role.ADMIN]),
    update
)

router.delete('/:id',
    validateRequest(patientIdSchema, 'params'),
    authenticate,
    authorize([Role.ADMIN, Role.ADMIN]),
    remove
)

router.get('/me/appointments',
    authenticate,
    authorize([Role.PATIENT]),
    getAppointments
)

export default router;