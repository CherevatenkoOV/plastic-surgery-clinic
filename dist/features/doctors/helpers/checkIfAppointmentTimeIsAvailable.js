export function checkIfAppointmentTimeIsAvailable(doctor, newAppointmentTimeISO) {
    for (const appointment of doctor.appointments) {
        if (appointment && appointment.timeISO === newAppointmentTimeISO) {
            return false;
        }
    }
    if (newAppointmentTimeISO < new Date().toISOString()) {
        throw new Error("Unable to create an appointment in the past");
    }
    else {
        return true;
    }
}
