import express, {Router} from 'express';
import {
    deleteById, deleteMe, getAll, getById, getMe, updateById, updateMe
} from "./patients-controller.js";
import {validateRequest} from "../shared/middleware/validate-request.js";
import {patientIdSchema, searchPatientSchema, updatePatientSchema} from "./validation.js";
import {authenticate} from "../shared/middleware/authenticate.js";
import {authorize} from "../shared/middleware/authorize.js";
import {Role} from "../shared/roles.js";
import {getAppointments} from "../doctors/doctors-controller.js";

const router: Router = express.Router();

router.get('/me',
    validateRequest(patientIdSchema, 'params'),
    authenticate,
    authorize([Role.PATIENT]),
    getMe
)

router.get('/:id',
    validateRequest(patientIdSchema, 'params'),
    authenticate,
    authorize([Role.DOCTOR, Role.ADMIN]),
    getById
)

router.get('/',
    validateRequest(searchPatientSchema, 'query'),
    authenticate,
    authorize([Role.ADMIN, Role.DOCTOR]),
    getAll
)

router.patch('/me',
    validateRequest(patientIdSchema, 'params'),
    validateRequest(updatePatientSchema, 'body'),
    authenticate,
    authorize([Role.PATIENT]),
    updateMe
)

router.patch('/:id',
    validateRequest(patientIdSchema, 'params'),
    validateRequest(updatePatientSchema, 'body'),
    authenticate,
    authorize([Role.ADMIN]),
    updateById
)

router.delete('/me',
    validateRequest(patientIdSchema, 'params'),
    authenticate,
    authorize([Role.PATIENT]),
    deleteMe
)

router.delete('/:id',
    validateRequest(patientIdSchema, 'params'),
    authenticate,
    authorize([Role.PATIENT]),
    deleteById
)

router.get('/me/appointments',
    authenticate,
    authorize([Role.PATIENT]),
    getAppointments
)

export default router;