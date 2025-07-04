import {getPatientsData} from "./getPatientsData.js";

export const getAppointmentsByPatientId = async (patientId) => {
    const patients = await getPatientsData();
    console.log(patients)
    if(!patients) {
        throw new Error("When getting patients something went wrong")
    } else {
        const patient = patients.find(patient => patient.id === patientId);
        console.log(patient)
        return patient.appointments;
    }
}