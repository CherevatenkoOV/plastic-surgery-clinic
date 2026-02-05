import { Request, Response } from "express";
import { PatientsFlow } from "./patients-flow.js";
import { PatientFilter, PatientWithUser, PatientsParamsDto, UpdatePatientDto } from "./types.js";

export class PatientsController {
    constructor(private readonly patientsFlow: PatientsFlow) {}

    getMany = async (req: Request, res: Response<PatientWithUser[] | { message: string }>): Promise<void> => {
        const filter = req.query as unknown as PatientFilter;
        const patients = await this.patientsFlow.getPatients(filter);

        if (!patients.length) {
            res.status(404).send({ message: "Patients not found" });
            return;
        }

        res.status(200).send(patients);
    };

    getById = async (
        req: Request<PatientsParamsDto>,
        res: Response<PatientWithUser | { message: string }>
    ): Promise<void> => {
        const patientId = req.params.patientId;

        if (!patientId) {
            res.status(400).send({ message: "Missing patientId parameter" });
            return;
        }

        const patient = await this.patientsFlow.getPatientById(patientId);

        if (!patient) {
            res.status(404).send({ message: "Patient was not found" });
            return;
        }

        res.status(200).send(patient);
    };

    getMe = async (req: Request, res: Response<PatientWithUser | { message: string }>): Promise<void> => {
        const loggedUser = req.user!;
        const patient = await this.patientsFlow.getPatientById(loggedUser.id);

        if (!patient) {
            res.status(404).send({ message: "Patient was not found" });
            return;
        }

        res.status(200).send(patient);
    };

    updateById = async (
        req: Request<PatientsParamsDto, unknown, UpdatePatientDto>,
        res: Response<PatientWithUser | { message: string }>
    ): Promise<void> => {
        const patientId = req.params.patientId;

        if (!patientId) {
            res.status(400).send({ message: "Missing patientId parameter" });
            return;
        }

        const updatedPatient = await this.patientsFlow.updatePatient(patientId, req.body);
        res.status(200).send(updatedPatient);
    };

    updateMe = async (
        req: Request<unknown, unknown, UpdatePatientDto>,
        res: Response<PatientWithUser | { message: string }>
    ): Promise<void> => {
        const loggedUser = req.user!;
        const updatedPatient = await this.patientsFlow.updatePatient(loggedUser.id, req.body);
        res.status(200).send(updatedPatient);
    };

    deleteMe = async (req: Request, res: Response<void | { message: string }>): Promise<void> => {
        const loggedUser = req.user!;
        await this.patientsFlow.deletePatient(loggedUser.id);
        res.sendStatus(204);
    };

    deleteById = async (req: Request<PatientsParamsDto>, res: Response<void | { message: string }>): Promise<void> => {
        const patientId = req.params.patientId;

        if (!patientId) {
            res.status(400).send({ message: "Missing patientId parameter" });
            return;
        }

        await this.patientsFlow.deletePatient(patientId);
        res.sendStatus(204);
    };
}
