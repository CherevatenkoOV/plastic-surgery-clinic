import { Router } from "express";
import { PatientsController } from "./patients-controller.js";
import { validateRequest } from "../shared/middleware/validate-request.js";
import { patientIdSchema, searchPatientSchema, updatePatientSchema } from "./validation.js";
import { authenticate } from "../shared/middleware/authenticate.js";
import { authorize } from "../shared/middleware/authorize.js";
import { Role } from "../shared/roles.js";

export function createPatientsRouter(patientsController: PatientsController) {
    const router = Router();

    router.get(
        "/me",
        authenticate,
        authorize([Role.PATIENT]),
        patientsController.getMe
    );

    router.get(
        "/",
        validateRequest(searchPatientSchema, "query"),
        authenticate,
        authorize([Role.ADMIN, Role.DOCTOR]),
        patientsController.getMany
    );

    router.get(
        "/:patientId",
        validateRequest(patientIdSchema, "params"),
        authenticate,
        authorize([Role.DOCTOR, Role.ADMIN]),
        patientsController.getById
    );

    router.patch(
        "/me",
        validateRequest(updatePatientSchema, "body"),
        authenticate,
        authorize([Role.PATIENT]),
        patientsController.updateMe
    );

    router.patch(
        "/:patientId",
        validateRequest(patientIdSchema, "params"),
        validateRequest(updatePatientSchema, "body"),
        authenticate,
        authorize([Role.ADMIN]),
        patientsController.updateById
    );

    router.delete(
        "/me",
        authenticate,
        authorize([Role.PATIENT]),
        patientsController.deleteMe
    );

    router.delete(
        "/:patientId",
        validateRequest(patientIdSchema, "params"),
        authenticate,
        authorize([Role.ADMIN]),
        patientsController.deleteById
    );

    return router;
}
