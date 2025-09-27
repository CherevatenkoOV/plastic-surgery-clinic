import {Doctor} from "../doctors/types.js";
import {UpdateUserData} from "../users/types.js";

export interface Patient {
    userId: string;
    phone: string | null;
}

export type CreatePatientBody = Omit<Patient, "userId">;

export type UpdatePatientData = Partial<Omit<Patient, "userId">>

export type UpdatePatientBody = UpdatePatientData & UpdateUserData;


export interface PatientsQuery {
    firstName?: string;
    lastName?: string;
}

// NOTE: presumably should by Partial, because of Admin, which can update/delete patient by params, not by token->id
export interface PatientsParams {
    id: string;
}


