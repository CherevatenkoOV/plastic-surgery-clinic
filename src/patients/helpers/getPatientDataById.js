import {getPatientsData} from "./getPatientsData.js";

export const getPatientDataById = async (patientId) => {
    const patients = await getPatientsData();
    if(!patients) {
        throw new Error("The patient was not found")
    } else {
        const targetPatient = patients.find(patient => patient.id === patientId);
        if(!targetPatient) {
            throw new Error("The patient with the specified id was not found")
        } else {
            return targetPatient;
        }
    }
}