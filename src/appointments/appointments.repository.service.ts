import {Injectable} from "@nestjs/common";
import { DbClient } from "../shared/prisma/db-client.type";
import {AppointmentEntity, AppointmentFilter, CreateAppointmentInput, UpdateAppointmentInput } from "src/appointments/appointments.types";
import { AppointmentWhereInput } from "src/generated/prisma/models";

@Injectable()
export class AppointmentsRepositoryService {

    async find(db: DbClient, filter?: AppointmentFilter): Promise<AppointmentEntity[]> {
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

    async findById(db: DbClient, id: string): Promise<AppointmentEntity | null> {
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

    async create(db: DbClient, appointmentData: CreateAppointmentInput): Promise<AppointmentEntity> {
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

    async update(db: DbClient, id: string, appointmentData: UpdateAppointmentInput): Promise<AppointmentEntity> {
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

    async delete(db: DbClient, id: string): Promise<void> {
        await db.appointment.delete({
            where: {id}
        })
    }
}