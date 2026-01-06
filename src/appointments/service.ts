import {
    Appointment,
    AppointmentsFilter,
    CreateAppointmentDto,
    UpdateAppointmentDto,
} from "./types.js";
import {IAppointmentsRepository} from "./repository/i-appointments-repository.js";

export class AppointmentsService {
    constructor(private readonly appointmentsRepo: IAppointmentsRepository) {}

    async get(filter?: AppointmentsFilter): Promise<Appointment[]> {
        return await this.appointmentsRepo.find(filter)
    }

    async getById(id: string): Promise<Appointment | undefined> {
        return await this.appointmentsRepo.findById(id);
    }

    // TODO: refactor according to change format of doctor schedules
    async create(appointmentData: CreateAppointmentDto): Promise<Appointment> {
        return await this.appointmentsRepo.create(appointmentData)
    }

    async update(id: string, appointmentData: UpdateAppointmentDto) {
        return await this.appointmentsRepo.update(id, appointmentData)
    }

    async delete (id: string): Promise<void> {
        await this.appointmentsRepo.delete(id)
    }

}

