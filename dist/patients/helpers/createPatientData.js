import crypto from "node:crypto";
export const createPatientData = async (newPatientData, patients) => {
    const { firstName, lastName, phone, doctor, procedureType } = newPatientData;
    if (!newPatientData) {
        throw new Error("The data of new patient is empty");
    }
    else {
        const patientIsExist = !!patients.find(patient => patient.firstName === firstName && patient.lastName === lastName);
        if (patientIsExist) {
            throw new Error("The patient with the specified name already exists");
        }
        else {
            let uuid = crypto.randomUUID();
            while (!!patients.find(patient => patient.id === uuid)) {
                uuid = crypto.randomUUID();
            }
            const id = uuid;
            const createdAt = new Date().toISOString();
            const updatedAt = new Date().toISOString();
            return {
                id,
                firstName,
                lastName,
                phone,
                doctor,
                procedureType,
                createdAt,
                updatedAt
            };
        }
    }
};
