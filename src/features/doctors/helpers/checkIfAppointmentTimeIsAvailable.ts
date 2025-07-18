import {AppointmentTimeISO, Doctor} from "../doctors.types.js";

export const checkIfAppointmentTimeIsAvailable = (doctor: Doctor, newAppointmentTimeISO: AppointmentTimeISO): boolean | Error => {
        for (const appointment of doctor.appointments) {
            if (appointment && appointment.timeISO === newAppointmentTimeISO) {
                return false;
            }
        }

        if(newAppointmentTimeISO < new Date().toISOString()) {
            throw new Error("Unable to create an appointment in the past")
        } else {
            return true;
        }


}