import {Patient, Patients} from "../patients.types.js";

export const deletePatientData = async (targetPatient: Patient, patients: Patients): Promise<Patients> => {
    return patients.filter(patient => patient.id !== targetPatient.id)
}