import {AllPatientsAppointments, Patients} from "../patients.types.js";

export const getPatientsAppointments = async (patients: Patients): Promise<AllPatientsAppointments[]> => {
    return patients
        .filter(patient => patient.appointments.length)
        .map(patient => ({patientFirstName: patient.firstName, patientLastName: patient.lastName, appointments: patient.appointments}));
}