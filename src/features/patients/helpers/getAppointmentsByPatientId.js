import {getPatientDataById} from "./getPatientDataById.js";

export const getAppointmentsByPatientId = async (patientId, patients) => {
        const patient = getPatientDataById(patientId, patients);
        return patient.appointments;
}