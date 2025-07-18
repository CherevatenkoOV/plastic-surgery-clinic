import { checkIfAppointmentTimeIsAvailable } from "./checkIfAppointmentTimeIsAvailable.js";
export const createDoctorAppointment = async (targetDoctor, newAppointmentInfo) => {
    const { timeISO } = newAppointmentInfo;
    if (!checkIfAppointmentTimeIsAvailable(targetDoctor, timeISO)) {
        throw new Error("Specified time is occupied. Try to choose another time");
    }
    else {
        targetDoctor.appointments.push(newAppointmentInfo);
        return targetDoctor;
    }
};
