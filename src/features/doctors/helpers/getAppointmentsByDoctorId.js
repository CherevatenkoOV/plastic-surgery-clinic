import {getDoctorDataById} from "./getDoctorDataById.js";

export const getAppointmentsByDoctorId = async (doctorId, doctors) => {
        const doctor = await getDoctorDataById(doctorId, doctors);
        return doctor.appointments;
}