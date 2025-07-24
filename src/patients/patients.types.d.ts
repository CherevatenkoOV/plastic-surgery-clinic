export type Id = string;

export type Patient = {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
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
    procedureType: string;
    createdAt: string;
    updatedAt: string;
}

export type PatientsQuery = {
    firstName?: string;
    lastName?: string;
}
