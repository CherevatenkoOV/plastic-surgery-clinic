import {
 PatientsParams, UpdatePatientBody
} from "./types.js";
import {Request, Response} from "express";
import {Service} from "./service.js";
import {AllInfoUser} from "../users/types.js";
import {Appointment} from "../appointments/types.js";

export const getAll = async (req: Request, res: Response<AllInfoUser[]>): Promise<void> => {
    const patients = await Service.getPatients(req)
    res.status(200).send(patients)
}

export const getById = async (req: Request, res: Response<AllInfoUser | undefined>) => {
    const patient = await Service.getPatientById(req)
    res.status(200).send(patient)
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


