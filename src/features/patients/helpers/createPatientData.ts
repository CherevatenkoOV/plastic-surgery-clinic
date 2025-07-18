import crypto from "node:crypto";
import {NewPatientData, Patients, Id} from "../patients.types.js";

// TODO
// update this function. new version has firstName and lastName instead of name
export const createPatientData = async (newPatientData: NewPatientData, patients: Patients): Promise<NewPatientData> => {

    const {firstName, lastName, phone, doctor, appointments, procedureType} = newPatientData;

    if (!newPatientData) {
        throw new Error("The data of new patient is empty")
    } else {
        const patientIsExist = !!patients.find(patient => patient.firstName === firstName && patient.lastName === lastName);

        if (patientIsExist) {
            throw new Error("The patient with the specified name already exists")
        } else {
            let uuid = crypto.randomUUID() as Id;

            while (!!patients.find(patient => patient.id === uuid)) {
                uuid = crypto.randomUUID()
            }

            const id = uuid as Id;
            const createdAt = new Date().toISOString();
            const updatedAt = new Date().toISOString();

            return {
                id,
                firstName,
                lastName,
                phone,
                doctor,
                appointments,
                procedureType,
                createdAt,
                updatedAt
            }
        }
    }
}