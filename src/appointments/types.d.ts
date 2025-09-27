
export interface Appointment {
    id: string;
    doctorId: string;
    patientId: string;
    procedureType: string;
    timeISO: string;
    createdAt: string;
    updatedAt: string;
}

export type CreateAppointmentBody = Omit<Appointment, "id" | "createdAt" | "updatedAt">;

export type UpdateAppointmentBody = Partial<Omit<Appointment, "id" | "createdAt" | "updatedAt">>;


export interface AppointmentsQuery {
    doctorId?: string;
    patientId?: string;
}

export interface AppointmentsParams {
    id: string
}


export interface Options {
    type: "create" | "update" | "delete";
}

export interface WithId {
    id: string;
}

