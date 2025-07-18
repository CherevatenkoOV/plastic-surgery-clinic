import express, {Router} from 'express';
import {
    deletePatientById, getAppointments,
    getPatientById,
    getPatients,
    putPatient,
    updatePatientById
} from "./patients.controllers.ts";
import {validateRequest} from "../../shared/middleware/validateRequest.js";
import {createPatientSchema, patientIdSchema, searchPatientSchema, updatePatientSchema} from "./patients.validation.js";

const router: Router = express.Router();

router.get('/appointments',
    validateRequest(patientIdSchema, 'query'),
    getAppointments
)

router.get('/',
    validateRequest(searchPatientSchema, 'query'),
    getPatients
)

router.get('/:id',
    validateRequest(patientIdSchema, 'params'),
    getPatientById
)

router.put('/',
    validateRequest(createPatientSchema, 'body'),
    putPatient
)

router.patch('/:id',
    validateRequest(patientIdSchema, 'params'),
    validateRequest(updatePatientSchema, 'body'),
    updatePatientById
)

router.delete('/:id',
    validateRequest(patientIdSchema, 'params'),
    deletePatientById
)

export default router;