export function checkIfAppointmentTimeIsAvailable(doctor, newAppointmentTimeISO){
    try {
        for (const appointment of doctor.appointments) {
            if (appointment.timeISO === newAppointmentTimeISO) {
                return false;
            }
        }
        return true;
    } catch(err) {
        return err.message
    }
}