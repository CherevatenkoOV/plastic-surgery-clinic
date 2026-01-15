import {FullUserBase, UpdateUserDto, FullUserBase} from "../users/types.js";
import {Patient} from "../generated/prisma/client";

// Доменная проекция пациента (минимум полей, которые ты используешь как "сущность пациента")
export type PatientEntity = Prisma.PatientGetPayload<{
    select: {
        patientId: true;
        phone: true;
    };
}>;

// Профиль пациента = patient + user (как DoctorWithUser у тебя)
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

// Если тебе нужен "полный профиль" в стиле FullPatientDto (user base + roleData)
// можно использовать это как тип результата из репозитория, а не DTO:
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

// Если у тебя есть эндпоинт, который обновляет и user, и patient за один запрос:
export type UpdatePatientBody = UpdatePatientDto & UpdateUserDto;

export interface PatientFilter {
    firstName?: string;
    lastName?: string;
    phone?: string;
}

export interface PatientsParamsDto {
    patientId?: string;
}








// =====================++++++++=======++++++=====+++++++====++++
// OLD VERSION
// =====================++++++++=======++++++=====+++++++====++++

// export type PatientEntity = Patient
//
//
// export interface FullPatientDto extends FullUserBase{
//     roleData: PatientDto | undefined
// }
//
// export interface CreatePatientDto {
//     userId: string;
//     phone: string | null;
// }
//
// export interface UpdatePatientDto {
//     firstName?: string | undefined;
//     lastName?: string | undefined;
//     phone?: string | null;
// }
//
//
//
// export type UpdatePatientBody = UpdatePatientData & UpdateUserDto;
//
// export interface PatientsParamsDto {
//     id?: string;
// }
//
// // NOTE: maybe is deprecated. check it
// // export type PatientFilter = Pick<Patient, "userId">
//
// export interface FullPatientFilter {
//     firstName?: string;
//     lastName?: string;
// }
//



