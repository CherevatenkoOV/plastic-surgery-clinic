import {getDoctorsData} from "./getDoctorsData.js";
import {doctorsConstants} from "../doctorsConstants.js";

export const getDoctorDataById = async (doctorId) => {
    const doctors = await getDoctorsData();
    if(!doctors) {
        throw new Error(doctorsConstants.errorMessages.GETTING_DOCTOR_ERROR)
    } else {
        const targetDoctor = doctors.find(doctor => doctor.id === doctorId);
        if(!targetDoctor) {
            throw new Error(doctorsConstants.errorMessages.DOCTOR_NOT_FOUND)
        } else {
            return targetDoctor;
        }
    }
}