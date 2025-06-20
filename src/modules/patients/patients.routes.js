import express from 'express';
import { getClinicData } from '../../utils/getClinicData.js';
import {getPatientById, getPatients} from "./patients.controllers.js";

const router = express.Router();
// const clinicData = getClinicData();
// const patients = clinicData["Patients"]

router.get('/', getPatients)

router.get('/:id', getPatientById)

export default router;