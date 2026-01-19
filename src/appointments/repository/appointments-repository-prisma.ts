import {
    AppointmentEntity,
    AppointmentFilter,
    CreateAppointmentDto,
    UpdateAppointmentDto
} from "../types";
import {IAppointmentsRepository} from "./i-appointments-repository";
import {AppointmentWhereInput} from "../../generated/prisma/models/Appointment";
import {PrismaClient} from "../../generated/prisma/client";
import {DbClient} from "../../shared/db";

export class AppointmentsRepositoryPrisma implements IAppointmentsRepository {
    constructor(private readonly prisma: PrismaClient) {
    }

    async find(filter?: AppointmentFilter, db: DbClient = this.prisma): Promise<AppointmentEntity[]> {
        const where: AppointmentWhereInput = {}

        if (filter?.doctorId) where.doctorId = filter.doctorId
        if (filter?.patientId) where.patientId = filter.patientId

        const prismaAppointments = await db.appointment.findMany({
            where,
            select: {
                id: true,
                doctorId: true,
                patientId: true,
                serviceName: true,
                startsAt: true,
                createdAt: true,
                updatedAt: true
            },
        })

        if (filter &&
            (filter.doctorId || filter.patientId) &&
            prismaAppointments.length === 0) throw new Error("No appointments matched the filter")

        return prismaAppointments
    }

    async findById(id: string, db: DbClient = this.prisma): Promise<AppointmentEntity | null> {
        return db.appointment.findUnique({
            where: {id},
            select: {
                id: true,
                doctorId: true,
                patientId: true,
                serviceName: true,
                startsAt: true,
                createdAt: true,
                updatedAt: true
            }
        })
    }

    async create(appointmentData: CreateAppointmentDto, db: DbClient = this.prisma): Promise<AppointmentEntity> {
        const {doctorId, patientId, serviceName, startsAt} = appointmentData

        return db.appointment.create({
            data: {
                doctorId,
                patientId,
                serviceName,
                startsAt
            },
            select: {
                id: true,
                doctorId: true,
                patientId: true,
                serviceName: true,
                startsAt: true,
                createdAt: true,
                updatedAt: true
            }
        })
    }

    async update(id: string, appointmentData: UpdateAppointmentDto, db: DbClient = this.prisma): Promise<AppointmentEntity> {
        const {doctorId, patientId, serviceName, startsAt} = appointmentData;

        return db.appointment.update({
            where: {id},
            data: {
                doctorId,
                patientId,
                serviceName,
                startsAt
            },
            select: {
                id: true,
                doctorId: true,
                patientId: true,
                serviceName: true,
                startsAt: true,
                createdAt: true,
                updatedAt: true
            }
        })
    }

    async delete(id: string, db: DbClient = this.prisma): Promise<void> {
        await db.appointment.delete({
            where: {id}
        })
    }
}