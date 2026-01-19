import { IAppointmentsRepository } from "./repository/i-appointments-repository";
import { IDoctorsRepository } from "../doctors/repository/i-doctors-repository";
import { IPatientsRepository } from "../patients/repository/i-patients-repository";
import {
    AppointmentEntity,
    AppointmentFilter,
    CreateAppointmentDto,
    UpdateAppointmentDto,
} from "./types";
import {PrismaClient} from "../generated/prisma/client";
import {DbClient} from "../shared/db";

type ISODateString = string;

export interface AppointmentTimeCheckInput {
    doctorId: string;
    startsAt: ISODateString;
}

export class AppointmentsFlow {
    constructor(
        private readonly prisma: PrismaClient,
        private readonly appointmentsRepo: IAppointmentsRepository,
        private readonly doctorsRepo: IDoctorsRepository,
        private readonly patientsRepo: IPatientsRepository
    ) {}


    async getAppointments(filter?: AppointmentFilter): Promise<AppointmentEntity[]> {
        return this.appointmentsRepo.find(filter, this.prisma);
    }

    async getAppointmentById(id: string): Promise<AppointmentEntity | null> {
        const appointmentId = id.trim();

        return this.appointmentsRepo.findById(appointmentId, this.prisma);
    }

    async getDoctorAppointments(doctorId: string): Promise<AppointmentEntity[]> {
        const id = doctorId.trim();

        return this.appointmentsRepo.find({ doctorId: id }, this.prisma);
    }

    async getPatientAppointments(patientId: string): Promise<AppointmentEntity[]> {
        const id = patientId.trim();

        return this.appointmentsRepo.find({ patientId: id }, this.prisma);
    }

    async createAppointment(input: CreateAppointmentDto): Promise<AppointmentEntity> {
        const doctorId = input.doctorId.trim();
        const patientId = input.patientId.trim();
        const serviceName = input.serviceName.trim();
        const startsAtISO = input.startsAt;

        const startsAt = this.parseISODateOrThrow(startsAtISO);
        this.assertNotPast(startsAt);

        return this.prisma.$transaction(async (tx) => {
            const doctor = await this.doctorsRepo.findById(doctorId, tx);
            if (!doctor) throw new Error("Doctor not found");

            const patient = await this.patientsRepo.findById(patientId, tx);
            if (!patient) throw new Error("Patient not found");

            await this.assertDoctorSlotAvailable({ doctorId, startsAt: startsAtISO }, tx);

            return this.appointmentsRepo.create(
                { doctorId, patientId, serviceName, startsAt: startsAtISO },
                tx
            );
        });
    }

    async updateAppointment(id: string, patch: UpdateAppointmentDto): Promise<AppointmentEntity> {
        const appointmentId = id.trim();

        const updatePatch: UpdateAppointmentDto = {};
        if (patch.doctorId !== undefined) updatePatch.doctorId = patch.doctorId.trim();
        if (patch.patientId !== undefined) updatePatch.patientId = patch.patientId.trim();
        if (patch.serviceName !== undefined) updatePatch.serviceName = patch.serviceName.trim();
        if (patch.startsAt !== undefined) updatePatch.startsAt = patch.startsAt;

        return this.prisma.$transaction(async (tx) => {
            const appointment = await this.appointmentsRepo.findById(appointmentId, tx);
            if (!appointment) throw new Error("Appointment not found");

            if (updatePatch.doctorId) {
                const doctor = await this.doctorsRepo.findById(updatePatch.doctorId, tx);
                if (!doctor) throw new Error("Doctor not found");
            }

            if (updatePatch.patientId) {
                const patient = await this.patientsRepo.findById(updatePatch.patientId, tx);
                if (!patient) throw new Error("Patient not found");
            }

            if (updatePatch.startsAt) {
                const startsAt = this.parseISODateOrThrow(updatePatch.startsAt);
                this.assertNotPast(startsAt);

                const doctorIdToCheck = updatePatch.doctorId ?? appointment.doctorId;

                await this.assertDoctorSlotAvailable(
                    { doctorId: doctorIdToCheck, startsAt: updatePatch.startsAt },
                    tx,
                    { ignoreAppointmentId: appointment.id }
                );
            }

            return this.appointmentsRepo.update(appointmentId, updatePatch, tx);
        });
    }

    async deleteAppointment(id: string): Promise<void> {
        const appointmentId = id.trim();

        const appointment = await this.appointmentsRepo.findById(appointmentId, this.prisma);
        if (!appointment) throw new Error("Appointment not found");

        await this.appointmentsRepo.delete(appointmentId, this.prisma);
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
        input: AppointmentTimeCheckInput,
        db: DbClient,
        opts?: { ignoreAppointmentId?: string }
    ): Promise<void> {
        const doctorId = input.doctorId.trim();
        const targetMs = this.parseISODateOrThrow(input.startsAt).getTime();

        const appointments = await this.appointmentsRepo.find({ doctorId }, db);

        const conflict = appointments.some((a) => {
            if (opts?.ignoreAppointmentId && a.id === opts.ignoreAppointmentId) return false;
            return a.startsAt.getTime() === targetMs;
        });

        if (conflict) throw new Error("Time slot is already taken");
    }
}
