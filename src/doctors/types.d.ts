
export interface ScheduleItem {
    _day: string;
    day: string;
    isAvailable: boolean;
    start: string;
    end: string;
}


export interface Doctor {
    id: string;
    firstName: string;
    lastName: string;
    specialization: string;
    schedule: ScheduleItem[];
    createdAt: string;
    updatedAt: string;
}

export type CreateDoctorBody = Omit<Doctor, "id" | "createdAt" | "updatedAt">;

export type UpdateDoctorBody = Partial<Omit<Doctor, "id" | "createdAt" | "updatedAt">>

export interface DoctorsQuery {
    firstName?: string;
    lastName?: string;
    specialization?: string;
}

export interface DoctorsParams {
    id: string
}
