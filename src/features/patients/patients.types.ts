export type Id = string;


export type AppointmentsItem = {
    doctorFirstName: string;
    doctorLastName: string;
    procedureType: string;
    timeISO: string;
}

export type Appointments = AppointmentsItem[];

export type Patient = {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    appointments: Appointments;
    createdAt: string;
    updatedAt: string;
}

export type Patients = Patient[];

export type NewPatientData = {
    id: Id;
    firstName: string;
    lastName: string;
    phone: string;
    doctor: string;
    appointments: Appointments;
    procedureType: string;
    createdAt: string;
    updatedAt: string;
}

export type PatientsQuery = {
    firstName?: string;
    lastName?: string;
}

export type AllPatientsAppointments = {
    patientFirstName: string;
    patientLastName: string;
    appointments: Appointments;
}