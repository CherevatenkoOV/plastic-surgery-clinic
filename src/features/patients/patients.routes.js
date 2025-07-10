import express from 'express';
import {
    deletePatientById, getAppointments,
    getPatientById,
    getPatients,
    putPatient,
    updatePatientById
} from "./patients.controllers.js";
import {tryCatch} from "../../shared/utils/tryCatch.js";
import {validateRequest} from "../../shared/middleware/validateRequest.js";
import {createPatientSchema, patientIdSchema, searchPatientSchema, updatePatientSchema} from "./patients.validation.js";

const router = express.Router();

router.get('/appointments',
    validateRequest(patientIdSchema, 'query.id'),
    tryCatch(getAppointments)
)

router.get('/',
    validateRequest(searchPatientSchema, 'query'),
    tryCatch(getPatients))

router.get('/:id',
    validateRequest(patientIdSchema, 'params'),
    tryCatch(getPatientById)
)

router.put('/',
    validateRequest(createPatientSchema, 'body'),
    tryCatch(putPatient)
)

router.patch('/:id',
    validateRequest(patientIdSchema, 'params'),
    validateRequest(updatePatientSchema, 'body'),
    tryCatch(updatePatientById))

router.delete('/:id',
    validateRequest(patientIdSchema, 'params'),
    tryCatch(deletePatientById))

export default router;