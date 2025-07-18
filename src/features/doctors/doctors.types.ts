export type Id = string;

export type ScheduleItem = {
    _day: string;
    day: string;
    isAvailable: boolean;
    start: string;
    end: string;
}

export type Schedule = ScheduleItem[];

export type AppointmentTimeISO = string;

export type AppointmentsItem = {
    timeISO: AppointmentTimeISO;
    patientFirstName: string;
    patientLastName: string;
}

export type Appointments = AppointmentsItem[];

export type Doctor = {
    id: Id;
    firstName: string;
    lastName: string;
    specialization: string;
    schedule: Schedule;
    appointments: Appointments;
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

export type AllDoctorsAppointments = {
    doctorFirstName: string;
    doctorLastName: string;
    appointments: Appointments;
}