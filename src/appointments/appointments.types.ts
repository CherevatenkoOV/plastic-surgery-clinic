import type { Prisma } from "../generated/prisma/client";

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

export type CreateAppointmentInput = Pick<AppointmentEntity, "doctorId" | "patientId" | "serviceName"> & {
    startsAt: Date
}

export type UpdateAppointmentInput = Partial<
    Pick<AppointmentEntity, "doctorId" | "patientId" | "serviceName" | "startsAt">
>;

export type AppointmentFilter = Partial<Pick<AppointmentEntity, "doctorId" | "patientId">>









