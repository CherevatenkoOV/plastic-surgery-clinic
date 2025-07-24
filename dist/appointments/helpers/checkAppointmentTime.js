export const checkAppointTime = (appointments, newAppointment) => {
    const { doctorId, patientId, timeISO, procedureType } = newAppointment;
    if (timeISO < new Date().toISOString()) {
        throw new Error("Unable to create an appointment in the past");
    }
    for (const appointment of appointments) {
        if (appointment.doctorId === doctorId && appointment.timeISO === timeISO) {
            return false;
        }
    }
    return true;
};
