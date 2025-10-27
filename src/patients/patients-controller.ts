import {
    PatientsParams, UpdatePatientBody
} from "./types.js";
import {Request, Response} from "express";
import {Service} from "./service.js";
import {AllInfoUser} from "../users/types.js";
import {Appointment} from "../appointments/types.js";
import {removeSensitiveData} from "../users/helpers/remove-sensitive-data.js";

export const getAll = async (req: Request, res: Response<AllInfoUser[]>): Promise<void> => {
    const patients = await Service.get(req)

    if (!patients.length) res.sendStatus(404)

    const publicPatients = await removeSensitiveData(patients)
    res.status(200).send(publicPatients)
}

export const getById = async (req: Request, res: Response<AllInfoUser | undefined>) => {
    const patient = await Service.get(req)

    if (!patient.length) res.sendStatus(404)

    const publicPatient = await removeSensitiveData(patient)
    res.status(200).send(publicPatient)
}

export const update = async (req: Request<{}, unknown, UpdatePatientBody>, res: Response<AllInfoUser>): Promise<void> => {
    const updatedPatient = await Service.updatePatient(req)
    res.status(200).send(updatedPatient)
}

export const remove = async (req: Request, res: Response<void>): Promise<void> => {
    await Service.deletePatient(req)
    res.status(204).send()
}

export const getAppointments = async (req: Request, res: Response<Appointment[]>): Promise<void> => {
    const appointments = await Service.getAppointments(req)
    res.status(200).send(appointments)
}


