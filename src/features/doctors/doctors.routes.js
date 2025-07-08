import express from 'express';
import {
    createAppointment,
    putDoctor,
    deleteDoctorById,
    getAllAppointments,
    getDoctorById,
    getDoctors, updateDoctorById, getDoctorAppointments
} from "./doctors.controllers.js";
import {tryCatch} from "../../shared/utils/tryCatch.js";
import {validateRequest} from "../../shared/middleware/validateRequest.js";
import {createAppointmentSchema, createDoctorSchema, doctorIdSchema, updateDoctorSchema} from "./doctors.validation.js";

const router = express.Router();

router.get('/:id/appointments',
    validateRequest(doctorIdSchema, 'params'),
    tryCatch(getDoctorAppointments)
)

router.get('/all-appointments', tryCatch(getAllAppointments))

router.get('/', tryCatch(getDoctors))

router.get('/:id',
    validateRequest(doctorIdSchema, 'params'),
    tryCatch(getDoctorById)
)

router.put('/',
    validateRequest(createDoctorSchema, 'body'),
    tryCatch(putDoctor)
)

router.patch('/:id',
    validateRequest(doctorIdSchema, 'params'),
    validateRequest(updateDoctorSchema, 'body'),
    tryCatch(updateDoctorById)
)

router.put('/:id',
    validateRequest(doctorIdSchema, 'params'),
    validateRequest(createAppointmentSchema, 'body'),
    tryCatch(createAppointment)
)

router.delete('/:id',
    validateRequest(doctorIdSchema, 'params'),
    tryCatch(deleteDoctorById))

export default router;