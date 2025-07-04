import express from 'express';
import {
    deletePatientById,
    getPatientAppointments,
    getPatientById,
    getPatients,
    putPatient,
    updatePatientById
} from "./patients.controllers.js";

const router = express.Router();

router.get('/:id/appointments', getPatientAppointments)

router.get('/', getPatients)

router.get('/:id', getPatientById)

router.put('/', putPatient)

router.patch('/:id', updatePatientById)

router.delete('/:id', deletePatientById)

export default router;