import {
    AppointmentEntity, AppointmentFilter,
    CreateAppointmentDto,
    UpdateAppointmentDto
} from "../types.js";

export interface IAppointmentsRepository {
    find(filter?: AppointmentFilter): Promise<AppointmentEntity[]>;
    findById(id: string): Promise<AppointmentEntity | null>;
    create(appointmentData: CreateAppointmentDto): Promise<AppointmentEntity>;
    update(id: string, appointmentData: UpdateAppointmentDto): Promise<AppointmentEntity>;
    delete(id: string): Promise<void>;
}