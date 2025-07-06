import express from 'express';
import {
    deletePatientById,
    getPatientAppointments,
    getPatientById,
    getPatients,
    putPatient,
    updatePatientById
} from "./patients.controllers.js";
import {tryCatch} from "../utils/tryCatch.js";

const router = express.Router();

router.get('/:id/appointments', tryCatch(getPatientAppointments))

router.get('/', tryCatch(getPatients))

router.get('/:id', tryCatch(getPatientById))

router.put('/', tryCatch(putPatient))

router.patch('/:id', tryCatch(updatePatientById))

router.delete('/:id', tryCatch(deletePatientById))

export default router;