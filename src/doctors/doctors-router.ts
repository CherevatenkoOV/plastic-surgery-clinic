import express, {Router} from 'express';
import {getAll, getAppointments, getById, inviteDoctor, remove, update} from "./doctors-controller.js";
import {validateRequest} from "../shared/middleware/validate-request.js";
import {doctorIdSchema, searchDoctorSchema, updateDoctorSchema} from "./validation.js";
import {authorize} from "../shared/middleware/authorize.js";
import {Role} from "../shared/roles.js";
import {authenticate} from "../shared/middleware/authenticate.js";

const router: Router = express.Router();

router.get('/',
    validateRequest(searchDoctorSchema, 'query'),
    authenticate,
    authorize([Role.ADMIN, Role.PATIENT]),
    getAll
)

router.get('/me',
    validateRequest(doctorIdSchema, 'params'),
    authenticate,
    authorize([Role.DOCTOR]),
    getById
)
router.patch('/me',
    validateRequest(doctorIdSchema, 'params'),
    validateRequest(updateDoctorSchema, 'body'),
    authenticate,
    authorize([Role.DOCTOR]),
    update
)
router.delete('/me',
    validateRequest(doctorIdSchema, 'params'),
    authenticate,
    authorize([Role.DOCTOR]),
    remove
)

router.get('/:id',
    validateRequest(doctorIdSchema, 'params'),
    authenticate,
    authorize([Role.ADMIN, Role.PATIENT]),
    getById
)

router.patch('/:id',
    validateRequest(doctorIdSchema, 'params'),
    validateRequest(updateDoctorSchema, 'body'),
    authenticate,
    authorize([Role.ADMIN]),
    update
)

router.delete('/:id',
    validateRequest(doctorIdSchema, 'params'),
    authenticate,
    authorize([Role.ADMIN]),
    remove
)

router.get('/me/appointments',
    authenticate,
    authorize([Role.DOCTOR]),
    getAppointments
)

router.post('/invite',
    authenticate,
    authorize([Role.ADMIN]),
    inviteDoctor
)

export default router;