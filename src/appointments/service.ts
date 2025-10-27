import {Request} from "express";
import fs from "node:fs/promises";

import {randomUUID} from "node:crypto";
import {
    Appointment,
    AppointmentsParams,
    AppointmentsQuery,
    CreateAppointmentData,
    CreateAppointmentBody,
    UpdateAppointmentBody, UpdateAppointmentData
} from "./types.js";
import {paths} from "../shared/paths.js";
import {checkAppointmentTime} from "./helpers/check-appointment-time.js";

export class Service {
    static async getAppointments(req: Request): Promise<Appointment[]> {
        return await ServiceHelper.getAppointmentsData(req.query);
    }

    static async getAppointmentById(req: Request): Promise<Appointment | undefined> {
        return await ServiceHelper.getAppointmentDataById(req.params.id as string);
    }

    static async createAppointment(req: Request<{}, unknown, CreateAppointmentBody>): Promise<Appointment> {
        return await ServiceHelper.createAppointmentData(req.body)
    }

    static async updateAppointment(req: Request<AppointmentsParams, unknown, UpdateAppointmentBody>) {
        return await ServiceHelper.updateAppointmentData(req.params.id, req.body)
    }

    static async deleteAppointment(req: Request<AppointmentsParams>): Promise<void> {
        await ServiceHelper.deleteAppointmentData(req.params.id)
    }
}

export class ServiceHelper {

    static async getAppointmentsData(query?: AppointmentsQuery): Promise<Appointment[]> {

        try {
            const data: string = await fs.readFile(paths.APPOINTMENTS, {encoding: "utf-8"})
            const appointments: Appointment[] = JSON.parse(data)

            if (!query) return appointments;

            const {doctorId, patientId} = query;

            if (doctorId) {
                return appointments.filter((appointment: Appointment) => appointment.doctorId === doctorId)
            } else if (patientId) {
                return appointments.filter((appointment: Appointment) => appointment.patientId === patientId)
            } else {
                return appointments
            }

        } catch (err) {
            throw new Error(`Something went wrong while reading appointments.json. Err: ${err}`)
        }

    }

    static async getAppointmentDataById(id: string, appointments?: Appointment[]): Promise<Appointment | undefined> {
        const data: Appointment[] = appointments ?? await this.getAppointmentsData();
        return data.find((appointment: Appointment) => appointment.id === id)
    }

    static async createAppointmentData(appointmentData: CreateAppointmentData) {
        const appointments = await ServiceHelper.getAppointmentsData();

        const isAvailable = checkAppointmentTime(appointmentData, appointments);

        if (!isAvailable) throw new Error("Specified time to specified doctor is occupied. Try to choose another time")

        const id = randomUUID();
        const now = new Date().toISOString();
        const createdAt = now;
        const updatedAt = now;

        const newAppointment = {
            id,
            doctorId: appointmentData.doctorId,
            patientId: appointmentData.patientId,
            timeISO: appointmentData.timeISO,
            procedureType: appointmentData.procedureType,
            createdAt,
            updatedAt
        }

        appointments.push(newAppointment);

        await fs.writeFile(
            paths.APPOINTMENTS,
            JSON.stringify(appointments),
            {encoding: 'utf-8'},
        )

        return newAppointment;
    }

    static async updateAppointmentData(id: string, appointmentData: UpdateAppointmentData) {
        const appointments = await ServiceHelper.getAppointmentsData();
        const targetAppointment = appointments.find((appointment: Appointment) => appointment.id === id)

        if (!targetAppointment) throw new Error("Specified appointment is not found")

        const updatedAppointment: Appointment = {
            id: targetAppointment.id,
            doctorId: appointmentData.doctorId ?? targetAppointment.doctorId,
            patientId: appointmentData.patientId ?? targetAppointment.patientId,
            procedureType: appointmentData.procedureType ?? targetAppointment.procedureType,
            timeISO: appointmentData.timeISO ?? targetAppointment.timeISO,
            createdAt: targetAppointment.createdAt,
            updatedAt: new Date().toISOString()
        }

        const index = appointments.findIndex((appointment: Appointment) => appointment.id === targetAppointment.id);
        appointments[index] = updatedAppointment;

        await fs.writeFile(
            paths.APPOINTMENTS,
            JSON.stringify(appointments),
            {encoding: 'utf-8'},
        )

        return updatedAppointment;
    }

    static async deleteAppointmentData(id: string) {
        const appointments = await ServiceHelper.getAppointmentsData();
        const updatedAppointments = appointments.filter(appointment => appointment.id !== id)

        await fs.writeFile(
            paths.APPOINTMENTS,
            JSON.stringify(updatedAppointments),
            {encoding: 'utf-8'},
        )
    }

}