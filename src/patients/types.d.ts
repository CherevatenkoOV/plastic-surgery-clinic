import {UpdateUserDto} from "../users/types.js";


// ===== Prisma entities / Payloads =====

export type PatientEntity = Prisma.PatientGetPayload<{
    select: {
        patientId: true;
        phone: true;
    };
}>;

export type PatientWithUser = Prisma.PatientGetPayload<{
    select: {
        patientId: true;
        phone: true;
        user: {
            select: {
                id: true;
                firstName: true;
                lastName: true;
                role: true;
            };
        };
    };
}>;

export type PatientProfile = PatientWithUser;

// ===== DTO / app-level types =====

export interface PatientDto {
    patientId: string;
    phone: string;
}

export interface FullPatientDto extends FullUserBase {
    roleData: PatientDto | undefined;
}

export interface CreatePatientDto {
    patientId: string;
    phone: string;
}

export interface UpdatePatientDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
}

export type UpdatePatientBody = UpdatePatientDto & UpdateUserDto;

export interface PatientFilter {
    firstName?: string;
    lastName?: string;
    phone?: string;
}

export interface PatientsParamsDto {
    patientId?: string;
}




