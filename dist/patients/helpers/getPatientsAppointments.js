export const getPatientsAppointments = async (patients) => {
    return patients
        .filter(patient => patient.appointments.length)
        .map(patient => ({ patientFirstName: patient.firstName, patientLastName: patient.lastName, appointments: patient.appointments }));
};
