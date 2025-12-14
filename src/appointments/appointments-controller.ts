import {Request, Response} from "express";
import {
    AppointmentsParams,
    CreateAppointmentDto,
    Appointment,
    UpdateAppointmentDto
} from "./types.js";
import {Service} from "./service.js";

export const getAll = async (req: Request, res: Response<Appointment[] | {message: string}>): Promise<void> => {
    const filter = req.query
    const appointments = await Service.get(filter);

    if(!appointments.length) {
        res.status(404).send({message: "Doctors not found"})
        return
    }

    res.status(200).send(appointments)
}

export const getById = async (req: Request, res: Response<Appointment | {
    message: string
}>): Promise<void> => {
    const id = req.params.id

    if (!id) {
        res.status(400).send({message: "Missing id parameter"})
        return
    }

    const appointment = await Service.getById(id)

    if(!appointment) {
        res.status(404).send({message: "Appointment was not found"})
        return
    }

    res.status(200).send(appointment)
}

export const create = async (req: Request<{}, unknown, CreateAppointmentDto>, res: Response<Appointment>): Promise<void> => {
    const appointmentData = req.body
    const newAppointment = await Service.create(appointmentData);
    res.status(201).send(newAppointment)
}

export const update = async (req: Request<AppointmentsParams, unknown, UpdateAppointmentDto>, res: Response<Appointment | {
    message: string
}>): Promise<void> => {
    const id = req.params.id
    if (!id) {
        res.status(400).send({message: "Missing id parameter"})
        return
    }

    const appointmentData = req.body

    const updatedAppointment = await Service.update(id, appointmentData);
    res.status(200).send(updatedAppointment)
}

export const remove = async (req: Request<AppointmentsParams>, res: Response<boolean | {message: string}>): Promise<void> => {
    const id = req.params.id
    if (!id) {
        res.status(400).send({message: "Missing id parameter"})
        return
    }
    await Service.delete(id)
    res.status(204).send(true)
}




