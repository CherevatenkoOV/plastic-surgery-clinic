import {checkIfAppointmentTimeIsAvailable} from "./checkIfAppointmentTimeIsAvailable.js";
import {Doctor, AppointmentsItem} from "../doctors.types.js";

export const createDoctorAppointment = async (targetDoctor: Doctor, newAppointmentInfo: AppointmentsItem): Promise<Doctor> => {
    const {timeISO} = newAppointmentInfo;

    if (!checkIfAppointmentTimeIsAvailable(targetDoctor, timeISO)) {
        throw new Error("Specified time is occupied. Try to choose another time")
    } else {
        targetDoctor.appointments.push(newAppointmentInfo)

        return targetDoctor;
    }

}