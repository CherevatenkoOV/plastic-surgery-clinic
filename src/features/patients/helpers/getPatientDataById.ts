import {Id, Patient, Patients} from "../patients.types.js";

export const getPatientDataById = async (patientId: Id, patients: Patients): Promise<Patient> => {
        const targetPatient = patients.find(patient => patient.id === patientId);

        if(!targetPatient) {
            throw new Error("The patient with the specified id was not found")
        } else {
            return targetPatient;
        }
}