import { getPatientDataById } from "./getPatientDataById.js";
export const changePatientData = async (patientId, newPatientData, patients) => {
    if (!newPatientData) {
        throw new Error("New patient's data is empty");
    }
    else {
        const targetPatient = await getPatientDataById(patientId, patients);
        return {
            ...targetPatient,
            ...newPatientData
        };
    }
};
