import {getDoctorsData} from "./getDoctorsData.js";

export const getDoctorDataById = async (doctorId) => {
    const doctors = await getDoctorsData();
    if(!doctors) {
        throw new Error("The doctor was not found")
    } else {
        const targetDoctor = doctors.find(doctor => doctor.id === doctorId);
        if(!targetDoctor) {
            throw new Error("The doctor with the specified id was not found")
        } else {
            return targetDoctor;
        }
    }
}