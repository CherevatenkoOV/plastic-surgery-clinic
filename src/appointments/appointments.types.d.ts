export type Id = string;

export type Appointment = {
    id: Id;
    doctorId: Id;
    patientId: Id;
    procedureType: string;
    timeISO: string;
    createdAt: string;
    updatedAt: string;
}

export type AppointmentBody = Omit<Appointment, "id" | "createdAt" | "updatedAt">;

export type AppointmentsQuery = {
    doctorId?: Id;
    patientId?: Id;
}

export type AppointmentsParams = {
    id: Id
}

export type AppointmentsReqData = {
    params?: AppointmentsParams;
    query?: AppointmentsQuery;
}

export type Options = {
    type: "create" | "update" | "delete";
}

export type WithId = {
    id: Id;
}

