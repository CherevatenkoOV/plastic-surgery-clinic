import express from 'express';
import {createAppointment, getAppointments, getDoctorById, getDoctors} from "./doctors.controllers.js";
const router = express.Router();

router.get('/appointments', getAppointments)

router.get('/', getDoctors)

router.get('/:id', getDoctorById)

router.put('/:id', createAppointment)

export default router;