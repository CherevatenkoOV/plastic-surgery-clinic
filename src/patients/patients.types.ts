
import { Prisma } from "src/generated/prisma/client";

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
                firstName: true;
                lastName: true;
                role: true;
            };
        };
    };
}>;

export interface CreatePatientDto {
    patientId: string;
    phone: string;
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


export interface PatientFilter {
    firstName?: string;
    lastName?: string;
    phone?: string;
}




