import {
    FullPatientDto, PatientsParamsDto, UpdatePatientBody
} from "./types.js";
import {Request, Response} from "express";
import {Appointment} from "../appointments/types.js";
import {PatientsService} from "./service.js";

export class PatientsController {
    constructor(private readonly patientsService: PatientsService){}

    async getAll  (req: Request, res: Response<FullPatientDto[] | { message: string }>): Promise<void> {
        const filter = req.query

        const patients = await this.patientsService.get(filter)

        if (!patients.length) {
            res.status(404).send({message: "Patients not found"})
            return
        }

        res.status(200).send(patients)
    }


    async getById  (req: Request<PatientsParamsDto>, res: Response<FullPatientDto | {
        message: string
    }>): Promise<void> {
        const id = req.params.id

        if (!id) {
            res.status(400).send({message: "Missing id parameter"})
            return
        }

        const patient = await this.patientsService.getById(id)

        if (!patient) {
            res.status(404).send({message: "Patient was not found"})
            return
        }

        res.status(200).send(patient)
    }

    async getMe  (req: Request, res: Response<FullPatientDto | { message: string }>): Promise<void> {
        const loggedUser = req.user!
        const id = loggedUser.id

        if (!id) {
            res.status(400).send({message: "Missing id parameter"})
            return
        }

        const patient = await this.patientsService.getById(id)

        if (!patient) {
            res.status(404).send({message: "Patient was not found"})
            return
        }

        res.status(200).send(patient)
    }

    async updateById  (req: Request<PatientsParamsDto, unknown, UpdatePatientBody>, res: Response<FullPatientDto | {
        message: string
    }>): Promise<void> {
        const id = req.params.id!
        if (!id) {
            res.status(400).send({message: "Missing id parameter"})
            return
        }
        const patientData = req.body

        const updatedPatient = await this.patientsService.update(id, patientData)
        res.status(200).send(updatedPatient)
    }

    async updateMe  (req: Request<unknown, unknown, UpdatePatientBody>, res: Response<FullPatientDto | {
        message: string
    }>): Promise<void> {
        const loggedUser = req.user!
        const patientData = req.body


        const updatedPatient = await this.patientsService.update(loggedUser.id, patientData)
        res.status(200).send(updatedPatient)
    }

    async deleteMe (req: Request<PatientsParamsDto>, res: Response<boolean | {
        message: string
    }>): Promise<void> {
        const loggedUser = req.user!

        await this.patientsService.delete(loggedUser.id)
        res.status(204).send(true)
    }

    async deleteById (req: Request<PatientsParamsDto>, res: Response<boolean | {
        message: string
    }>): Promise<void> {
        const id = req.params.id
        if (!id) {
            res.status(400).send({message: "Missing id parameter"})
            return
        }

        await this.patientsService.delete(id)
        res.status(204).send(true)
    }

    async getAppointments  (req: Request, res: Response<Appointment[]>): Promise<void> {
        const appointments = await this.patientsService.getAppointments(req)
        res.status(200).send(appointments)
    }

}
