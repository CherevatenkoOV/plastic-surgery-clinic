import type { Prisma } from "../generated/prisma/client";

// ===== Prisma entities / Payloads =====

export type AppointmentEntity = Prisma.AppointmentGetPayload<{
    select: {
        id: true;
        doctorId: true;
        patientId: true;
        serviceName: true;
        startsAt: true;          
        createdAt: true;
        updatedAt: true;
    };
}>;


// ===== DTO / app-level types =====

type ISODateString = string;

export interface AppointmentDto {
    id: string;
    doctorId: string;
    patientId: string;
    serviceName: string;
    startsAt: ISODateString;
    createdAt: ISODateString;
    updatedAt: ISODateString;
}

export interface CreateAppointmentDto {
    doctorId: string;
    patientId: string;
    serviceName: string;
    startsAt: ISODateString;
}

export type UpdateAppointmentDto = Partial<
    Omit<AppointmentDto, "id" | "createdAt" | "updatedAt">
>;

export interface AppointmentFilter {
    doctorId?: string;
    patientId?: string;
}

export interface AppointmentsParamsDto {
    id?: string;
}








