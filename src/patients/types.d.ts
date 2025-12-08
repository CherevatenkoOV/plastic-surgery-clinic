import {Doctor} from "../doctors/types.js";
import {FullUserBase, UpdateUserDto, FullUserBase} from "../users/types.js";

export interface Patient {
    userId: string;
    phone: string | null;
}

export interface FullPatientDto extends FullUserBase{
    roleData: PatientDto | undefined
}

export type CreatePatientBody = Omit<Patient, "userId">;

export type UpdatePatientData = Partial<Omit<Patient, "userId">>

export type UpdatePatientBody = UpdatePatientData & UpdateUserDto;

export interface PatientsParams {
    id?: string;
}

export type PatientFilter = Pick<Patient, "userId">



