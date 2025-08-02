import express, {Router} from 'express';
import {
    create,
    getAll, getById, remove, update
} from "./patients-controller.js";
import {validateRequest} from "../shared/middleware/validate-request.js";
import {createPatientSchema, patientIdSchema, searchPatientSchema, updatePatientSchema} from "./validation.js";

const router: Router = express.Router();

router.get('/',
    validateRequest(searchPatientSchema, 'query'),
    getAll
)

router.get('/:id',
    validateRequest(patientIdSchema, 'params'),
    getById
)

router.put('/',
    validateRequest(createPatientSchema, 'body'),
    create
)

router.patch('/:id',
    validateRequest(patientIdSchema, 'params'),
    validateRequest(updatePatientSchema, 'body'),
    update
)

router.delete('/:id',
    validateRequest(patientIdSchema, 'params'),
    remove
)

export default router;