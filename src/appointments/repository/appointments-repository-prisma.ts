import {
    AppointmentEntity,
    AppointmentFilter,
    CreateAppointmentDto,
    ISODateString,
    UpdateAppointmentDto
} from "../types";
import {IAppointmentsRepository} from "./i-appointments-repository";
import {AppointmentWhereInput} from "../../generated/prisma/models/Appointment";
import {PrismaClient} from "../../generated/prisma/client";

export class AppointmentsRepositoryPrisma implements IAppointmentsRepository {
    constructor(private readonly prisma: PrismaClient) {
    }

    // DONE
    async find(filter?: AppointmentFilter): Promise<AppointmentEntity[]> {
        const where: AppointmentWhereInput = {}

        if (filter?.doctorId) where.doctorId = filter.doctorId
        if (filter?.patientId) where.patientId = filter.patientId

        const prismaAppointments = await this.prisma.appointment.findMany({
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

    // DONE
    async findById(id: string): Promise<AppointmentEntity | null> {
        return this.prisma.appointment.findUnique({
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

    // DONE
    async create(appointmentData: CreateAppointmentDto): Promise<AppointmentEntity> {
        const {doctorId, patientId, serviceName, startsAt} = appointmentData

        return this.prisma.appointment.create({
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

    // DONE
    async update(id: string, appointmentData: UpdateAppointmentDto): Promise<AppointmentEntity> {
        const {doctorId, patientId, serviceName, startsAt} = appointmentData;

        return this.prisma.appointment.update({
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

    // DONE
    async delete(id: string): Promise<void> {
        await this.prisma.appointment.delete({
            where: {id}
        })
    }
}