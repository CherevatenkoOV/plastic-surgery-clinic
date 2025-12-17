import {Doctor} from "../doctors/types.js";
import {FullUserBase, UpdateUserDto, FullUserBase} from "../users/types.js";

export interface Patient {
    userId: string;
    phone: string | null;
}

export interface FullPatientDto extends FullUserBase{
    roleData: PatientDto | undefined
}

export interface CreatePatientDto {
    userId: string;
    phone: string | null;
}

export interface UpdatePatientDto {
    firstName?: string | undefined;
    lastName?: string | undefined;
    phone?: string | null;
}



export type UpdatePatientBody = UpdatePatientData & UpdateUserDto;

export interface PatientsParamsDto {
    id?: string;
}

// NOTE: maybe is deprecated. check it
// export type PatientFilter = Pick<Patient, "userId">

export interface FullPatientFilter {
    firstName?: string;
    lastName?: string;
}




