import {Appointment, AppointmentsFilter, CreateAppointmentDto, UpdateAppointmentDto} from "../types.js";

export interface IAppointmentsRepository {
    find(filter?: AppointmentsFilter): Promise<Appointment[]>;
    findById(id: string): Promise<Appointment | undefined>;
    create(appointmentData: CreateAppointmentDto): Promise<Appointment>;
    update(id: string, appointmentData: UpdateAppointmentDto): Promise<Appointment>;
    delete(id: string): Promise<void>;
}