import { Request, Response } from "express";
import {
    AppointmentEntity,
    AppointmentFilter,
    AppointmentsParamsDto,
    CreateAppointmentDto,
    UpdateAppointmentDto,
} from "./types.js";
import { AppointmentsFlow } from "./appointments-flow.js";

export class AppointmentsController {
    constructor(private readonly appointmentsFlow: AppointmentsFlow) {}

    getAll = async (
        req: Request,
        res: Response<AppointmentEntity[] | { message: string }>
    ): Promise<void> => {
        const filter = req.query as unknown as AppointmentFilter;
        const appointments = await this.appointmentsFlow.getAppointments(filter);

        if (!appointments.length) {
            res.status(404).send({ message: "Appointments not found" });
            return;
        }

        res.status(200).send(appointments);
    };

    getById = async (
        req: Request<AppointmentsParamsDto>,
        res: Response<AppointmentEntity | { message: string }>
    ): Promise<void> => {
        const id = req.params.id;

        if (!id) {
            res.status(400).send({ message: "Missing id parameter" });
            return;
        }

        const appointment = await this.appointmentsFlow.getAppointmentById(id);

        if (!appointment) {
            res.status(404).send({ message: "Appointment was not found" });
            return;
        }

        res.status(200).send(appointment);
    };

    create = async (
        req: Request<unknown, unknown, CreateAppointmentDto>,
        res: Response<AppointmentEntity | { message: string }>
    ): Promise<void> => {
        const appointmentData = req.body;
        const created = await this.appointmentsFlow.createAppointment(appointmentData);
        res.status(201).send(created);
    };

    update = async (
        req: Request<AppointmentsParamsDto, unknown, UpdateAppointmentDto>,
        res: Response<AppointmentEntity | { message: string }>
    ): Promise<void> => {
        const id = req.params.id;

        if (!id) {
            res.status(400).send({ message: "Missing id parameter" });
            return;
        }

        const updated = await this.appointmentsFlow.updateAppointment(id, req.body);
        res.status(200).send(updated);
    };

    remove = async (
        req: Request<AppointmentsParamsDto>,
        res: Response<void | { message: string }>
    ): Promise<void> => {
        const id = req.params.id;

        if (!id) {
            res.status(400).send({ message: "Missing id parameter" });
            return;
        }

        await this.appointmentsFlow.deleteAppointment(id);
        res.sendStatus(204);
    };
}
