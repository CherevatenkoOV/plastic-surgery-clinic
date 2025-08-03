import {Appointment, CreateAppointmentBody} from "../types.js";


export const checkAppointmentTime = (appointments: Appointment[], newAppointment: CreateAppointmentBody) => {
    const {doctorId, timeISO} = newAppointment;

    if(timeISO < new Date().toISOString()) {
        throw new Error("Unable to create an appointment in the past")
    }

    for (const appointment of appointments) {
        if (appointment.doctorId === doctorId && appointment.timeISO === timeISO) {
            return false;
        }
    }

    return true;
}