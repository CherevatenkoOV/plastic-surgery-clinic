import express, {Router} from 'express';
import {
    deleteById,
    deleteMe,
    getAll,
    getAppointments,
    getById,
    getMe,
    inviteDoctor,
    updateById,
    updateMe
} from "./doctors-controller.js";
import {validateRequest} from "../shared/middleware/validate-request.js";
import {doctorIdSchema, searchDoctorSchema, updateDoctorSchema} from "./validation.js";
import {authorize} from "../shared/middleware/authorize.js";
import {Role} from "../shared/roles.js";
import {authenticate} from "../shared/middleware/authenticate.js";

const router: Router = express.Router();


router.get('/me',
    validateRequest(doctorIdSchema, 'params'),
    authenticate,
    authorize([Role.DOCTOR]),
    getMe
)

router.get('/:id',
    authenticate,
    authorize([Role.PATIENT, Role.ADMIN]),
    getById
)

router.get('/',
    validateRequest(searchDoctorSchema, 'query'),
    authenticate,
    authorize([Role.ADMIN, Role.PATIENT]),
    getAll
)

router.patch('/me',
    validateRequest(doctorIdSchema, 'params'),
    validateRequest(updateDoctorSchema, 'body'),
    authenticate,
    authorize([Role.DOCTOR]),
    updateMe
)

router.patch('/:id',
    validateRequest(doctorIdSchema, 'params'),
    validateRequest(updateDoctorSchema, 'body'),
    authenticate,
    authorize([Role.DOCTOR]),
    updateById
)

router.delete('/me',
    validateRequest(doctorIdSchema, 'params'),
    authenticate,
    authorize([Role.DOCTOR]),
    deleteMe
)


router.delete('/:id',
    validateRequest(doctorIdSchema, 'params'),
    authenticate,
    authorize([Role.ADMIN]),
    deleteById
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