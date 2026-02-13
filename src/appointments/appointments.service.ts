import {BadRequestException, ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "src/shared/prisma/prisma.service";
import {AppointmentsRepositoryService} from "src/shared/repositories/appointments.repository.service";
import {DoctorsRepositoryService} from "src/shared/repositories/doctors.repository.service";
import {PatientsRepositoryService} from "src/shared/repositories/patients.repository.service";
import {AppointmentEntity, AppointmentFilter, UpdateAppointmentInput} from "./appointments.types";
import {DbClient} from "../shared/prisma/db-client.type";
import {CreateAppointmentDto} from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";

type ISODateString = string;

@Injectable()
export class AppointmentsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly appointmentsRepo: AppointmentsRepositoryService,
        private readonly doctorsRepo: DoctorsRepositoryService,
        private readonly patientsRepo: PatientsRepositoryService
    ) {
    }

    async getAppointments(filter: AppointmentFilter, db?: DbClient): Promise<AppointmentEntity[]> {
        const dbClient = db ?? this.prisma
        return this.appointmentsRepo.find(dbClient, filter);
    }

    async getAppointmentById(id: string, db?: DbClient): Promise<AppointmentEntity> {
        const dbClient = db ?? this.prisma
        const appointment = await this.appointmentsRepo.findById(dbClient, id);

        if(!appointment) throw new NotFoundException('Appointment with specified id was not found')

        return appointment
    }

    async getDoctorAppointments(doctorId: string, db?: DbClient): Promise<AppointmentEntity[]> {
        const dbClient = db ?? this.prisma

        return this.appointmentsRepo.find(dbClient, {doctorId});
    }

    async getPatientAppointments(patientId: string, db?: DbClient): Promise<AppointmentEntity[]> {
        const dbClient = db ?? this.prisma

        return this.appointmentsRepo.find(dbClient, {patientId});
    }

    async createAppointment(dto: CreateAppointmentDto): Promise<AppointmentEntity> {
        const doctorId = dto.doctorId.trim();
        const patientId = dto.patientId.trim();
        const serviceName = dto.serviceName.trim();
        const startsAt = this.parseISODateOrThrow(dto.startsAt);

        this.assertNotPast(startsAt);

        return this.prisma.$transaction(async (tx) => {
            const doctor = await this.doctorsRepo.findById(tx, doctorId);
            if (!doctor) throw new Error("Doctor not found");

            const patient = await this.patientsRepo.findById(tx, patientId);
            if (!patient) throw new Error("Patient not found");

            await this.assertDoctorSlotAvailable(doctorId, startsAt, tx);

            return this.appointmentsRepo.create(
                tx,
                {doctorId, patientId, serviceName, startsAt: startsAt},
            );
        });
    }

    async updateAppointment(id: string, dto: UpdateAppointmentDto): Promise<AppointmentEntity> {

        const updatePatch: UpdateAppointmentInput = {};
        if (dto.doctorId !== undefined) updatePatch.doctorId = dto.doctorId.trim();
        if (dto.patientId !== undefined) updatePatch.patientId = dto.patientId.trim();
        if (dto.serviceName !== undefined) updatePatch.serviceName = dto.serviceName.trim();
        if (dto.startsAt !== undefined) updatePatch.startsAt = this.parseISODateOrThrow(dto.startsAt);

        return this.prisma.$transaction(async (tx) => {
            const appointment = await this.appointmentsRepo.findById(tx, id);
            if (!appointment) throw new Error("Appointment not found");

            if (updatePatch.doctorId) {
                const doctor = await this.doctorsRepo.findById(tx, updatePatch.doctorId);
                if (!doctor) throw new Error("Doctor not found");
            }

            if (updatePatch.patientId) {
                const patient = await this.patientsRepo.findById(tx, updatePatch.patientId);
                if (!patient) throw new Error("Patient not found");
            }

            if (updatePatch.startsAt) {
                this.assertNotPast(updatePatch.startsAt);

                const doctorIdToCheck = updatePatch.doctorId ?? appointment.doctorId;

                await this.assertDoctorSlotAvailable(
                    doctorIdToCheck,
                    updatePatch.startsAt,
                    tx,
                    appointment.id
                );
            }

            return this.appointmentsRepo.update(tx, id, updatePatch);
        });
    }

    async deleteAppointment(id: string, db?: DbClient): Promise<void> {
        const dbDlient = db ?? this.prisma
        const appointment = await this.appointmentsRepo.findById(dbDlient, id);
        if (!appointment) throw new Error("Appointment not found");

        await this.appointmentsRepo.delete(dbDlient, id);
    }

    // ===== helpers =====

    private parseISODateOrThrow(value: ISODateString): Date {
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) throw new Error("Invalid startsAt date");
        return d;
    }

    private assertNotPast(startsAt: Date): void {
        if (startsAt.getTime() < Date.now()) {
            throw new Error("Unable to create an appointment in the past");
        }
    }

    private async assertDoctorSlotAvailable(
        doctorId: string,
        startsAt: Date,
        db: DbClient,
        ignoreAppointmentId?: string,
    ): Promise<void> {
        if (Number.isNaN(startsAt.getTime())) {
            throw new BadRequestException('Invalid startsAt date');
        }

        const appointments = await this.appointmentsRepo.find(db, { doctorId });

        const conflict = appointments.some(a =>
            a.startsAt.getTime() === startsAt.getTime() &&
            a.id !== ignoreAppointmentId
        );

        if (conflict) {
            throw new ConflictException('Time slot is already taken');
        }
    }

}
