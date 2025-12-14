import fs from "node:fs/promises";

import {randomUUID} from "node:crypto";
import {
    Appointment,
    AppointmentsFilter,
    CreateAppointmentDto,
    UpdateAppointmentDto,
} from "./types.js";
import {paths} from "../shared/paths.js";
import {checkAppointmentTime} from "./helpers/check-appointment-time.js";

export class Service {
    static async get(filter?: AppointmentsFilter): Promise<Appointment[]> {
        return await ServiceHelper.getAppointmentsData(filter)
    }

    static async getById(id: string): Promise<Appointment | undefined> {
        return await ServiceHelper.getAppointmentDataById(id);
    }

    static async create(appointmentData: CreateAppointmentDto): Promise<Appointment> {
        return await ServiceHelper.createAppointmentData(appointmentData)
    }

    static async update(id: string, appointmentData: UpdateAppointmentDto) {
        return await ServiceHelper.updateAppointmentData(id, appointmentData)
    }

    static async delete (id: string): Promise<void> {
        await ServiceHelper.deleteAppointmentData(id)
    }

}

export class ServiceHelper {

    static async getAppointmentsData(filter?: AppointmentsFilter): Promise<Appointment[]> {
            const data: string = await fs.readFile(paths.APPOINTMENTS, {encoding: "utf-8"})
            const appointments: Appointment[] = JSON.parse(data)

            if (!filter || Object.keys(filter).length === 0) return appointments;

            let filteredAppointments = appointments
            if(filter?.doctorId) filteredAppointments = filteredAppointments.filter((a: Appointment) => a.doctorId?.toLowerCase() === filter.doctorId?.toLowerCase())
            if(filter?.patientId) filteredAppointments = filteredAppointments.filter((a: Appointment) => a.patientId?.toLowerCase() === filter.patientId?.toLowerCase())

            if(!filteredAppointments.length) throw new Error("Appointments were not found")

            return filteredAppointments
    }

    static async getAppointmentDataById(id: string): Promise<Appointment | undefined> {
        const appointments = await this.getAppointmentsData()
        const targetAppointment = appointments.find(a => a.id === id)
        if(!targetAppointment) throw new Error("The specified appointment was not found")

        return targetAppointment
    }

    static async createAppointmentData(appointmentData: CreateAppointmentDto) {
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

    static async updateAppointmentData(id: string, appointmentData: UpdateAppointmentDto) {
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