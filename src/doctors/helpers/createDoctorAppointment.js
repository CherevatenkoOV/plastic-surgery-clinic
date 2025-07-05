import {getDoctorsData} from "./getDoctorsData.js";
import {getDoctorDataById} from "./getDoctorDataById.js";
import {checkIfAppointmentTimeIsAvailable} from "./checkIfAppointmentTimeIsAvailable.js";
import {updateDoctorsData} from "./updateDoctorsData.js";

export const createDoctorAppointment = async (doctorId, newAppointmentInfo) => {
    const {timeISO} = newAppointmentInfo;
    const doctors = await getDoctorsData();
    const targetDoctor = await getDoctorDataById(doctorId, doctors)

    if (!checkIfAppointmentTimeIsAvailable(targetDoctor, timeISO)) {
        throw new Error("Specified time is occupied. Try to choose another time")
    } else {
        targetDoctor.appointments.push(newAppointmentInfo)
        await updateDoctorsData(doctors)

        return targetDoctor;
    }

}