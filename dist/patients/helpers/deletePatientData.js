export const deletePatientData = async (targetPatient, patients) => {
    return patients.filter(patient => patient.id !== targetPatient.id);
};
