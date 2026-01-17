import { CreateAppointmentDto} from "../types.js";

// NOTE: deprecated?
export const checkAppointmentTime = (newAppointment: CreateAppointmentDto, appointments: Appointment[]) => {
    const {doctorId, startsAt} = newAppointment;

    if(startsAt < new Date().toISOString()) {
        throw new Error("Unable to create an appointment in the past")
    }

    for (const appointment of appointments) {
        if (appointment.doctorId === doctorId && appointment.timeISO === startsAt) {
            return false;
        }
    }

    return true;
}