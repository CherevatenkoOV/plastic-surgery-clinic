import {
    AppointmentEntity, AppointmentFilter,
    CreateAppointmentDto,
    UpdateAppointmentDto
} from "../types.js";
import {DbClient} from "../../shared/db";

export interface IAppointmentsRepository {
    find(filter?: AppointmentFilter, db?: DbClient): Promise<AppointmentEntity[]>;
    findById(id: string, db?: DbClient): Promise<AppointmentEntity | null>;
    create(appointmentData: CreateAppointmentDto, db?: DbClient): Promise<AppointmentEntity>;
    update(id: string, appointmentData: UpdateAppointmentDto, db?: DbClient): Promise<AppointmentEntity>;
    delete(id: string, db?: DbClient): Promise<void>;
}