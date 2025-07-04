import {getDoctorsData} from "./getDoctorsData.js";

export const getAppointmentsByDoctorId = async (doctorId) => {
    const doctors = await getDoctorsData();
    if(!doctors) {
        throw new Error("When getting doctors something went wrong")
    } else {
        const doctor = doctors.find(doctor => doctor.id === doctorId);
        return doctor.appointments;
    }
}