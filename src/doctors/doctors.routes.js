import express from 'express';
import {
    createAppointment,
    putDoctor,
    deleteDoctorById,
    getAppointments,
    getDoctorById,
    getDoctors, updateDoctorById, getDoctorAppointments
} from "./doctors.controllers.js";

const router = express.Router();

router.get('/:id/appointments', getDoctorAppointments)

router.get('/appointments', getAppointments)

router.get('/', getDoctors)

router.get('/:id', getDoctorById)

router.put('/', putDoctor)

router.patch('/:id', updateDoctorById)

router.put('/:id', createAppointment)

router.delete('/:id', deleteDoctorById)

export default router;