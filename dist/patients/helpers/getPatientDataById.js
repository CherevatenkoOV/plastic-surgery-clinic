export const getPatientDataById = async (patientId, patients) => {
    const targetPatient = patients.find(patient => patient.id === patientId);
    if (!targetPatient) {
        throw new Error("The patient with the specified id was not found");
    }
    else {
        return targetPatient;
    }
};
