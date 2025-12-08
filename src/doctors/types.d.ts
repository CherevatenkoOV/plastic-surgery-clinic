import {UpdateUserDto, UserDto, FullUserBase} from "../users/types.js";


export interface Doctor {
    userId: string;
    specialization: string | null;
    schedule: ScheduleItem[] | [];
}

export interface FullDoctorDto extends FullUserBase{
    roleData: DoctorDto | undefined
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


export interface UpdateDoctorDto {
    firstName?: string | undefined;
    lastName?: string | undefined;
    specialization?: string | null;
    schedule?: ScheduleItem[] | [];
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

// NOTE: maybe is deprecated. check it
export type DoctorFilter = Partial<Pick<Doctor, "specialization">>

// export type FullDoctorFilter = DoctorFilter & UserFilter
export interface FullDoctorFilter {
    specialization?: string;
    firstName?: string;
    lastName?: string;
}
