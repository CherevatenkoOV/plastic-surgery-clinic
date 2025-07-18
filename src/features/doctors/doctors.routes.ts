import express from 'express';
import {
    createAppointment,
    putDoctor,
    deleteDoctorById,
    getAppointments,
    getDoctorById,
    getDoctors, updateDoctorById
} from "./doctors.controllers.ts";
import {validateRequest} from "../../shared/middleware/validateRequest.js";
import {
    createAppointmentSchema,
    createDoctorSchema,
    doctorIdSchema,
    searchDoctorSchema,
    updateDoctorSchema
} from "./doctors.validation.js";

const router = express.Router();

router.get('/appointments',
    validateRequest(doctorIdSchema, 'query'),
    getAppointments
)

router.get('/',
    validateRequest(searchDoctorSchema, 'query'),
    getDoctors)

router.get('/:id',
    validateRequest(doctorIdSchema, 'params'),
    getDoctorById
)

router.put('/',
    validateRequest(createDoctorSchema, 'body'),
    putDoctor
)

router.patch('/:id',
    validateRequest(doctorIdSchema, 'params'),
    validateRequest(updateDoctorSchema, 'body'),
    updateDoctorById
)

router.put('/:id',
    validateRequest(doctorIdSchema, 'params'),
    validateRequest(createAppointmentSchema, 'body'),
    createAppointment
)

router.delete('/:id',
    validateRequest(doctorIdSchema, 'params'),
    deleteDoctorById
)

export default router;