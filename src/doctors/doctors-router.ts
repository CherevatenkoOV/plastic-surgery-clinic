import express, {Router} from 'express';
import {remove, getAll, getById, create, update} from "./doctors-controller.js";
import {validateRequest} from "../shared/middleware/validate-request.js";
import {
    createDoctorSchema,
    doctorIdSchema,
    searchDoctorSchema,
    updateDoctorSchema
} from "./validation.js";

const router: Router = express.Router();


router.get('/',
    validateRequest(searchDoctorSchema, 'query'),
    getAll
)

router.get('/:id',
    validateRequest(doctorIdSchema, 'params'),
    getById
)

router.put('/',
    validateRequest(createDoctorSchema, 'body'),
    create
)

router.patch('/:id',
    validateRequest(doctorIdSchema, 'params'),
    validateRequest(updateDoctorSchema, 'body'),
    update
)

router.delete('/:id',
    validateRequest(doctorIdSchema, 'params'),
    remove
)

export default router;