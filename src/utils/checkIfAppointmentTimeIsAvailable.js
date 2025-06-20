export function checkIfAppointmentTimeIsAvailable(doctor, newAppointmentTimeISO){
    try {
        let isAvailable = true
        for (const appointment in doctor.appointments) {
            if (appointment.timeISO === newAppointmentTimeISO) {
                isAvailable = false;
                console.log("Specified time is occupied. Try to choose another time")
            }
        }
        return isAvailable
    } catch(err) {
        console.log(`Something went wrong with appointments`)
        return err.message
    }

}