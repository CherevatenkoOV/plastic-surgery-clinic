import {
    FullPatientDto, PatientsParamsDto, UpdatePatientBody
} from "./types.js";
import {Request, Response} from "express";
import {Service} from "./service.js";
import {Appointment} from "../appointments/types.js";

// NOTE: done
export const getAll = async (req: Request, res: Response<FullPatientDto[] | { message: string }>): Promise<void> => {
    const loggedUser = req.user

    if (!loggedUser) {
        res.status(401).send({message: "User not authenticated"})
        return
    }

    const patients = await Service.get()

    if (!patients.length) {
        res.status(404).send({message: "Patients not found"})
        return
    }

    res.status(200).send(patients)
}

// NOTE: done
export const getById = async (req: Request<PatientsParamsDto>, res: Response<FullPatientDto | {
    message: string
}>): Promise<void> => {
    const id = req.params.id

    if (!id) {
        res.status(400).send({message: "Missing id parameter"})
        return
    }

    const patient = await Service.getById(id)

    if (!patient) {
        res.status(404).send({message: "Patient was not found"})
        return
    }

    res.status(200).send(patient)
}

// NOTE: done
export const getMe = async (req: Request, res: Response<FullPatientDto | { message: string }>): Promise<void> => {
    const loggedUser = req.user!
    const id = loggedUser.id

    if (!id) {
        res.status(400).send({message: "Missing id parameter"})
        return
    }

    const patient = await Service.getById(id)

    if (!patient) {
        res.status(404).send({message: "Patient was not found"})
        return
    }

    res.status(200).send(patient)
}

// NOTE: done
export const updateById = async (req: Request<PatientsParamsDto, unknown, UpdatePatientBody>, res: Response<FullPatientDto | {
    message: string
}>): Promise<void> => {
    const id = req.params.id!
    if (!id) {
        res.status(400).send({message: "Missing id parameter"})
        return
    }
    const patientData = req.body

    const updatedPatient = await Service.update(id, patientData)
    res.status(200).send(updatedPatient)
}

// NOTE: done
export const updateMe = async (req: Request<unknown, unknown, UpdatePatientBody>, res: Response<FullPatientDto | {
    message: string
}>): Promise<void> => {
    const loggedUser = req.user!
    const patientData = req.body


    const updatedPatient = await Service.update(loggedUser.id, patientData)
    res.status(200).send(updatedPatient)
}

// NOTE: done
export const deleteMe = async (req: Request<PatientsParamsDto>, res: Response<boolean | {
    message: string
}>): Promise<void> => {
    const loggedUser = req.user!

    await Service.delete(loggedUser.id)
    res.status(204).send(true)
}

// NOTE: done
export const deleteById = async (req: Request<PatientsParamsDto>, res: Response<boolean | {
    message: string
}>): Promise<void> => {
    const id = req.params.id
    if (!id) {
        res.status(400).send({message: "Missing id parameter"})
        return
    }

    await Service.delete(id)
    res.status(204).send(true)
}


export const getAppointments = async (req: Request, res: Response<Appointment[]>): Promise<void> => {
    const appointments = await Service.getAppointments(req)
    res.status(200).send(appointments)
}


