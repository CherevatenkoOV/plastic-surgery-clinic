import {UpdateUserData} from "../users/types.js";

// NOTE: refactored
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

// NOTE: refactored
export type CreateDoctorBody = Omit<Doctor, "userId">;

export type UpdateDoctorData = Partial<Omit<Doctor, "userId">>

export type UpdateDoctorBody = UpdateDoctorData & UpdateUserData


export interface DoctorsQuery {
    specialization?: string;
}

export interface DoctorsParams {
    id: string;
}


