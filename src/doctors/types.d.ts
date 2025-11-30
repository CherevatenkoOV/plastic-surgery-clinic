import {UpdateUserData} from "../users/types.js";

export interface Doctor {
    userId: string;
    specialization: string | null;
    schedule: ScheduleItem[] | [];
}

export interface ScheduleItem {
    _day: string;
    day: string;
    isAvailable: boolean;
    start: string;
    end: string;
}

export type CreateDoctorBody = Omit<Doctor, "userId">;

export type UpdateDoctorData = Partial<Omit<Doctor, "userId">>

export type UpdateDoctorDto = UpdateDoctorData & UpdateUserData

export interface DoctorsQuery {
    specialization?: string;
}

export interface DoctorsParams {
    id?: string;
}

export interface DoctorInviteToken {
    inviteToken: string;
}

export type DoctorFilter = Pick<Doctor, "userId">

