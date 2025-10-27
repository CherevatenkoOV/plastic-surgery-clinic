import {Doctor} from "../doctors/types.js";
import {UpdateUserData} from "../users/types.js";

export interface Patient {
    userId: string;
    phone: string | null;
}

export type CreatePatientBody = Omit<Patient, "userId">;

export type UpdatePatientData = Partial<Omit<Patient, "userId">>

export type UpdatePatientBody = UpdatePatientData & UpdateUserData;

export interface PatientsParams {
    id?: string;
}

export type PatientFilter = Pick<Patient, "userId">



