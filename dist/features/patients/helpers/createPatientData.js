import crypto from "node:crypto";
export const createPatientData = async (newPatientData, patients) => {
    const { name, phone, doctor, appointment, procedureType } = newPatientData;
    if (!newPatientData) {
        throw new Error("The data of new patient is empty");
    }
    else {
        const patientIsExist = !!patients.find(patient => patient.name === name);
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
                name,
                phone,
                doctor,
                appointment,
                procedureType,
                createdAt,
                updatedAt
            };
        }
    }
};
