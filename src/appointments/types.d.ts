import type { Prisma, Appointment as PrismaAppointment } from "../generated/prisma/client";

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

export type AppointmentWithDoctorAndPatient = Prisma.AppointmentGetPayload<{
    select: {
        id: true;
        procedureType: true;
        startsAt: true;
        createdAt: true;
        updatedAt: true;
        doctor: {
            select: {
                doctorId: true;
                user: {
                    select: {
                        id: true;
                        firstName: true;
                        lastName: true;
                        role: true;
                    };
                };
            };
        };
        patient: {
            select: {
                patientId: true;
                user: {
                    select: {
                        id: true;
                        firstName: true;
                        lastName: true;
                        role: true;
                    };
                };
            };
        };
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
    id: string;
}

AppointmentTimeCheckInput







