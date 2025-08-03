import {Request, Response} from "express";
import {
    AppointmentsQuery,
    AppointmentsParams,
    CreateAppointmentBody,
    Appointment,
    UpdateAppointmentBody
} from "./types.js";
import {Service} from "./service.js";


export const getAll = async (req: Request<AppointmentsParams, unknown, unknown, AppointmentsQuery>, res: Response<Appointment[]>): Promise<void> => {
    const appointments = await Service.getAppointments(req);
    res.status(200).send(appointments)
}

export const getById = async (req: Request<AppointmentsParams>, res: Response<Appointment | undefined>): Promise<void> => {
    const appointment = await Service.getAppointmentById(req)
    res.status(200).send(appointment)
}

export const create = async (req: Request<{}, unknown, CreateAppointmentBody>, res: Response<Appointment>): Promise<void> => {
    const newAppointment = await Service.createAppointment(req);
    res.status(201).send(newAppointment)
} 

export const update = async (req: Request<AppointmentsParams, unknown, UpdateAppointmentBody>, res: Response<Appointment>): Promise<void> => {
    const updatedAppointment = await Service.updateAppointment(req);
    res.status(200).send(updatedAppointment)
}

export const remove = async (req: Request<AppointmentsParams>, res: Response<void>): Promise<void> => {
    await Service.deleteAppointment(req)
    res.status(204).send()
}

