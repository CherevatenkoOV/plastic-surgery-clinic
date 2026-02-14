import { addWeeklySlots } from "src/generated/prisma/sql";
import {DoctorWeeklySlot, Prisma} from "../generated/prisma/client";

export type DoctorEntity = Prisma.DoctorGetPayload<{
    select: {
        doctorId: true;
        specialization: true;
    };
}>;

export type DoctorWithUser = Prisma.DoctorGetPayload<{
    select: {
        doctorId: true;
        specialization: true;
        user: {
            select: {
                firstName: true;
                lastName: true;
                role: true;
            };
        };
    };
}>;



// TODO in the future functionality will be used pure SQL-raw for DB based on the type Slot below
export type Slot = Pick<DoctorWeeklySlot, "id" | "weekday"> & {
    startAt: Date;
    endAt: Date;
};


export interface CreateDoctorDto {
    doctorId: string;
    specialization: string;
}

export interface UpdateDoctorDto {
    firstName?: string;
    lastName?: string;
    specialization?: string;
    doctorWeeklySlots?: Slot[];
}

export interface DoctorFilter {
    firstName?: string;
    lastName?: string;
    specialization?: string;
}

export interface DoctorsParamsDto {
    doctorId?: string;
}

export type DoctorInviteToken = string

export type CreateSlotDto = Omit<Slot, "id" | "userId">

type ISODateString = string;

export type SlotDto = Pick<DoctorWeeklySlot, "id" | "weekday"> & {
    startAt: ISODateString
    endAt: ISODateString
}

// TODO probably depricated
// export type SlotId = Brand<string, "SlotId">

export type SlotId = string;

export type AddWeeklySlotsRow = addWeeklySlots.Result;

// TODO probably depricated
// export type AddWeeklySlotsResult = Awaited<ReturnType<typeof addWeeklySlots>>[number]

