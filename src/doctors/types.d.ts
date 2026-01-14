import {Doctor, DoctorWeeklySlots} from "../generated/prisma/client";
import {addWeeklySlots} from "../generated/prisma/sql/addWeeklySlots";

// ===== Prisma entities / Payloads =====

export type DoctorEntity = Doctor

export type DoctorWithUser = Prisma.DoctorGetPayload<{
    include: { user: true }
}>

export type DoctorWithWeeklySlots = Prisma.DoctorGetPayload<{
    include: { doctorWeeklySlots: true }
}>

export type DoctorWithUserAndWeeklySlots = Prisma.DoctorGetPayload<{
    include: { user: true, doctorWeeklySlots: true }
}>

export type DoctorWithUserAndAppointments = Prisma.DoctorGetPayload<{
    include: { user: true, appointments: true }
}>


// TODO in the future functionality will be used pure SQL-raw for DB based on the type Slot below
export type Slot = Pick<DoctorWeeklySlots, "id" | "weekday"> & {
    startAt: Date;
    endAt: Date;
};


// ===== DTO / app-levels types =====

export interface DoctorDto {
    doctorId: string;
    specialization: string | null;
}

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

export interface DoctorsQueryDto {
    specialization?: string;
}

export interface DoctorsParamsDto {
    id?: string;
}

export interface DoctorInviteToken {
    inviteToken: string;
}

export type CreateSlotDto = Omit<Slot, "id" | "userId">

type ISODateString = string;

export type SlotDto = Pick<DoctorWeeklySlots, "id" | "weekday"> & {
    startAt: ISODateString
    endAt: ISODateString
}

export type SlotId = Brand<string, "SlotId">

export type AddWeeklySlotsResult = Awaited<ReturnType<typeof addWeeklySlots>>[number]

