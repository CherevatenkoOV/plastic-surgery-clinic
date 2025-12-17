import {Request, Response} from "express";
import {
    AppointmentsParams,
    CreateAppointmentDto,
    Appointment,
    UpdateAppointmentDto
} from "./types.js";
import {AppointmentsService} from "./service.js";


export class AppointmentsController {
constructor(private readonly appointmentsService: AppointmentsService) {}

    getAll = async (req: Request, res: Response<Appointment[] | { message: string }>): Promise<void> => {
        const filter = req.query
        const appointments = await this.appointmentsService.get(filter);

        if (!appointments.length) {
            res.status(404).send({message: "Doctors not found"})
            return
        }

        res.status(200).send(appointments)
    }

    getById = async (req: Request, res: Response<Appointment | {
        message: string
    }>): Promise<void> => {
        const id = req.params.id

        if (!id) {
            res.status(400).send({message: "Missing id parameter"})
            return
        }

        const appointment = await this.appointmentsService.getById(id)

        if (!appointment) {
            res.status(404).send({message: "Appointment was not found"})
            return
        }

        res.status(200).send(appointment)
    }

    create = async (req: Request<{}, unknown, CreateAppointmentDto>, res: Response<Appointment>): Promise<void> => {
        const appointmentData = req.body
        const newAppointment = await this.appointmentsService.create(appointmentData);
        res.status(201).send(newAppointment)
    }

    update = async (req: Request<AppointmentsParams, unknown, UpdateAppointmentDto>, res: Response<Appointment | {
        message: string
    }>): Promise<void> => {
        const id = req.params.id
        if (!id) {
            res.status(400).send({message: "Missing id parameter"})
            return
        }

        const appointmentData = req.body

        const updatedAppointment = await this.appointmentsService.update(id, appointmentData);
        res.status(200).send(updatedAppointment)
    }

    remove = async (req: Request<AppointmentsParams>, res: Response<boolean | { message: string }>): Promise<void> => {
        const id = req.params.id
        if (!id) {
            res.status(400).send({message: "Missing id parameter"})
            return
        }
        await this.appointmentsService.delete(id)
        res.status(204).send(true)
    }


}