import {Request, Response} from "express";
import {UpdateDoctorBody} from "./types.js";
import {Service} from "./service.js";
import {AllInfoUser} from "../users/types.js";
import {Appointment} from "../appointments/types.js";


export const getAll = async (req: Request, res: Response<AllInfoUser[]>): Promise<void> => {
    const doctors = await Service.getDoctors(req)
    res.status(200).send(doctors)
}

export const getById = async (req: Request, res: Response<AllInfoUser | undefined>): Promise<void> => {
    const doctor = await Service.getDoctorById(req)
    res.status(200).send(doctor)
}

export const update = async (req: Request<{}, unknown, UpdateDoctorBody>, res: Response<AllInfoUser>): Promise<void> => {
    const updatedDoctor = await Service.updateDoctor(req)
    res.status(200).send(updatedDoctor)
}

export const remove = async (req: Request, res: Response<void>): Promise<void> => {
    await Service.deleteDoctor(req)
    res.status(204).send()
}

export const getAppointments = async (req: Request, res: Response<Appointment[]>): Promise<void> => {
    const appointments = await Service.getAppointments(req)
    res.status(200).send(appointments)
}

