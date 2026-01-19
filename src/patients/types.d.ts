

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
                firstName: true;
                lastName: true;
                role: true;
            };
        };
    };
}>;

export type PatientProfile = PatientWithUser;

// ===== DTO / app-level types =====

export interface CreatePatientDto {
    patientId: string;
    phone: string;
}

export interface CreatePatientInput {

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

export interface PatientsParamsDto {
    patientId?: string;
}




