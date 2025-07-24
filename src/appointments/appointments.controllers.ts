import {Request, Response} from "express";
import {getAppointmentsData} from "./helpers/getAppointments.js";
import { AppointmentsQuery, AppointmentsParams, AppointmentBody, Appointment } from "./appointments.types.js";
import { createAppointmentData } from "./helpers/createAppointment.js";
import { updateAppointments } from "./helpers/updateAppointments.js";

export const getAppointmentsController = async (req: Request<AppointmentsParams, any, any, AppointmentsQuery>, res: Response<Appointment[]>) => {
    const reqData = {
        query: req.query,
        params: req.params
    }
    const appointments = await getAppointmentsData(reqData);

    res.status(200).send(appointments)
}

export const putAppointmentController = async (req: Request<{}, any, AppointmentBody, any >, res: Response<Appointment[]>) => {
    const newAppointmentBody = req.body;
    const appointments = await getAppointmentsData();
    const newAppointment = await createAppointmentData(newAppointmentBody);
    const updatedAppointments = await updateAppointments(appointments, newAppointment, {type: 'create'})

    res.status(200).send(updatedAppointments)
} 

export const updateAppointmentsController = async (req: Request<AppointmentsParams, any, Partial<AppointmentBody>, any>, res: Response<Appointment[]>) => {
    const newAppointmentData = {
        id: req.params.id,
        ...req.body
    }
    const appointments = await getAppointmentsData();
    const updatedAppointments = await updateAppointments(appointments, newAppointmentData, {type: 'update'})
    
    res.status(200).send(updatedAppointments)
}

export const deleteAppointmensController = async (req: Request<AppointmentsParams>, res: Response<Appointment[]>) => {
    const newAppointmentData = {
        id: req.params.id
    }
    const appointments = await getAppointmentsData();
    const updatedAppointments = await updateAppointments(appointments, newAppointmentData, {type: 'delete'})
    
    res.status(200).send(updatedAppointments)
}

