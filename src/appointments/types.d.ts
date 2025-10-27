
export interface Appointment {
    id: string;
    doctorId: string;
    patientId: string;
    procedureType: string;
    timeISO: string;
    createdAt: string;
    updatedAt: string;
}

// TODO: Check if we can delete it
// export type CreateAppointmentData = Omit<Appointment, "timeISO" | "id" | "createdAt" | "updatedAt">

// NOTE: new
export type CreateAppointmentData = Omit<Appointment, "id" | "createdAt" | "updatedAt">

// TODO: Check if we can delete it
export type CreateAppointmentBody = Omit<Appointment, "id" | "createdAt" | "updatedAt">;

export type CreateAppointment = Omit<Appointment, "id" | "createdAt" | "updatedAt">;

export type UpdateAppointmentBody = Partial<Omit<Appointment, "id" | "createdAt" | "updatedAt">>;
// NOTE: NEW
export type UpdateAppointmentData= Partial<Omit<Appointment, "id" | "createdAt" | "updatedAt">>;

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

