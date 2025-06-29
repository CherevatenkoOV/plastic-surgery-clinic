import crypto from "node:crypto";
import {patientsConstants} from "../patientsConstants.js";
import {getPatientsData} from "./getPatientsData.js";

export const createPatient = async (newPatientData) => {
    const {name, phone, doctor, appointment, procedureType} = newPatientData;

    const patients = await getPatientsData();

    if (!patients) {
        throw new Error(patientsConstants.errorMessages.GETTING_ALL_PATIENTS_ERROR)
    } else {
        const patientIsExist = !!patients.find(patient => patient.name === name);

        if (patientIsExist) {
            throw new Error(patientsConstants.errorMessages.PATIENT_ALREADY_EXISTS)
        } else {
            let uuid = crypto.randomUUID();

            while (!!patients.find(patient => patient.id === uuid)) {
                uuid = crypto.randomUUID()
            }

            const id = uuid;

            return {
                id,
                name,
                phone,
                doctor,
                appointment,
                procedureType
            }
        }

    }
}