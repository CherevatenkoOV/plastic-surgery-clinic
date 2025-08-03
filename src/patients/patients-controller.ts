import {
    PatientsQuery,
    Patient, CreatePatientBody, PatientsParams, UpdatePatientBody
} from "./types.js";
import {Request, Response} from "express";
import {Service} from "./service.js";

export const getAll = async (req: Request<{}, unknown, unknown, PatientsQuery>, res: Response<Patient[]>): Promise<void> => {
    const patients = await Service.getPatients(req)
    res.status(200).send(patients)
}

export const getById = async (req: Request<PatientsParams>, res: Response<Patient>) => {
    const patient = await Service.getPatientById(req)
    res.status(200).send(patient)
}

export const create = async (req: Request<{}, unknown, CreatePatientBody>, res: Response<Patient>): Promise<void> => {
    const doctor = await Service.createPatient(req)
    res.status(200).send(doctor)
}

export const update = async (req: Request<PatientsParams, unknown, UpdatePatientBody>, res: Response<Patient>): Promise<void> => {
    const updatedPatient = await Service.updatePatient(req)
    res.status(200).send(updatedPatient)
}


export const remove = async (req: Request<PatientsParams>, res: Response<void>): Promise<void> => {
   await Service.deletePatient(req)

    res.status(204).send()
}


