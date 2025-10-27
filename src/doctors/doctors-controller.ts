import {Request, Response} from "express";
import {DoctorInviteToken, UpdateDoctorBody} from "./types.js";
import {Service} from "./service.js";
import {AllInfoUser} from "../users/types.js";
import {Appointment} from "../appointments/types.js";
import {removeSensitiveData} from "../users/helpers/remove-sensitive-data.js";


export const getAll = async (req: Request, res: Response<AllInfoUser[]>): Promise<void> => {
    const doctors = await Service.get(req)

    if (!doctors.length) res.sendStatus(404)

    const publicDoctors = await removeSensitiveData(doctors)
    res.status(200).send(publicDoctors)
}

export const getById = async (req: Request, res: Response<AllInfoUser[]>): Promise<void> => {
    const doctor = await Service.get(req)

    if (!doctor.length) res.sendStatus(404)

    const publicDoctor = await removeSensitiveData(doctor)
    res.status(200).send(publicDoctor)
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

export const inviteDoctor = async (req: Request, res: Response<DoctorInviteToken>): Promise<void> => {
    await Service.sendInviteDoctor(req)
    res.status(200).send()
}

