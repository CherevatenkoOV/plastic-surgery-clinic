import {getPatientDataById} from "./getPatientDataById.js";
import {Id, NewPatientData, Patient, Patients} from "../patients.types.js";

export const changePatientData = async (patientId: Id, newPatientData: NewPatientData, patients: Patients): Promise<Patient> => {
    if(!newPatientData) {
        throw new Error("New patient's data is empty")
    } else {
        const targetPatient = await getPatientDataById(patientId, patients);
        return {
            ...targetPatient,
            ...newPatientData
        }
    }
}