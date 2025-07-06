import express from 'express';
import {
    createAppointment,
    putDoctor,
    deleteDoctorById,
    getAllAppointments,
    getDoctorById,
    getDoctors, updateDoctorById, getDoctorAppointments
} from "./doctors.controllers.js";
import {tryCatch} from "../utils/tryCatch.js";

const router = express.Router();

router.get('/:id/appointments', tryCatch(getDoctorAppointments))

router.get('/all-appointments', tryCatch(getAllAppointments))

router.get('/', tryCatch(getDoctors))

router.get('/:id', tryCatch(getDoctorById))

router.put('/', tryCatch(putDoctor))

router.patch('/:id', tryCatch(updateDoctorById))

router.put('/:id', tryCatch(createAppointment))

router.delete('/:id', tryCatch(deleteDoctorById))

export default router;