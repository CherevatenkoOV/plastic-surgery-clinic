import express from 'express';
import {getPatientById, getPatients} from "./patients.controllers.js";

const router = express.Router();

router.get('/', getPatients)

router.get('/:id', getPatientById)

export default router;