import {Doctor} from "../doctors/types.js";

export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
}

export type CreatePatientBody = Omit<Patient, "id" | "createdAt" | "updatedAt">;

export type UpdatePatientBody = Partial<Omit<Patient, "id" | "createdAt" | "updatedAt">>;

// export interface NewPatientData {
//     id: string;
//     firstName: string;
//     lastName: string;
//     phone: string;
//     doctor: string;
//     procedureType: string;
//     createdAt: string;
//     updatedAt: string;
// }

export interface PatientsQuery  {
    firstName?: string;
    lastName?: string;
}

export interface PatientsParams {
    id: string;
}
