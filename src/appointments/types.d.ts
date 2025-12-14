
export interface Appointment {
    id: string;
    doctorId: string;
    patientId: string;
    procedureType: string;
    timeISO: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAppointmentDto {
    doctorId: string;
    patientId: string;
    procedureType: string;
    timeISO: string;
}

export type UpdateAppointmentDto = Partial<Omit<Appointment, "id" | "createdAt" | "updatedAt">>;

export interface AppointmentsFilter {
    doctorId?: string;
    patientId?: string;
}

export interface AppointmentsParams {
    id: string
}


