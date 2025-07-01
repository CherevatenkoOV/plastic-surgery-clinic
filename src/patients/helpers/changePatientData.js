import {getPatientDataById} from "./getPatientDataById.js";

export const changePatientData = async (newPatientData, id) => {
    const targetPatient = await getPatientDataById(id);
    return {
        ...targetPatient,
        ...newPatientData
    }
}