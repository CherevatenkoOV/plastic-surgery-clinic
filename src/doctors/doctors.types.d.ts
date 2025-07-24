export type Id = string;

export type ScheduleItem = {
    _day: string;
    day: string;
    isAvailable: boolean;
    start: string;
    end: string;
}

export type Schedule = ScheduleItem[];

export type Doctor = {
    id: Id;
    firstName: string;
    lastName: string;
    specialization: string;
    schedule: Schedule;
    createdAt: string;
    updatedAt: string;
}

export type Doctors = Doctor[];

export type NewDoctorData = {
    firstName: string;
    lastName: string;
    specialization: string;
}

export type SortOrder = 'asc' | 'desc';

export type DoctorsQuery = {
    sortOrder?: SortOrder;
    firstName?: string;
    lastName?: string;
    specialization?: string;
}
