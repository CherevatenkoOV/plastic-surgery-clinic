import express from 'express';
import {deletePatientById, getPatientById, getPatients, putPatient} from "./patients.controllers.js";

const router = express.Router();

router.get('/', getPatients)

router.get('/:id', getPatientById)

router.put('/', putPatient)

router.delete('/:id', deletePatientById)

export default router;