import crypto from "node:crypto";
import {getPatientsData} from "./getPatientsData.js";

export const createPatient = async (newPatientData) => {
    const {name, phone, doctor, appointment, procedureType} = newPatientData;

    const patients = await getPatientsData();

    if (!patients) {
        throw new Error("When getting patients something went wrong")
    } else {
        const patientIsExist = !!patients.find(patient => patient.name === name);

        if (patientIsExist) {
            throw new Error("The patient with the specified name already exists")
        } else {
            let uuid = crypto.randomUUID();

            while (!!patients.find(patient => patient.id === uuid)) {
                uuid = crypto.randomUUID()
            }

            const id = uuid;

            const createdAt = new Date().toISOString();
            const updatedAt = new Date().toISOString();

            return {
                id,
                name,
                phone,
                doctor,
                appointment,
                procedureType,
                createdAt,
                updatedAt
            }
        }

    }
}