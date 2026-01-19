import {IDoctorsRepository} from "./i-doctors-repository.js";
import {
    AddWeeklySlotsResult,
    CreateDoctorDto, CreateSlotDto,
    DoctorEntity,
    DoctorFilter, DoctorWithUser,
    Slot, SlotId,
    UpdateDoctorDto
} from "../types.js";
import {DoctorWhereInput} from "../../generated/prisma/models/Doctor";
import {getWeeklySlots} from "../../generated/prisma/sql/getWeeklySlots.js";
import {addWeeklySlots} from "../../generated/prisma/sql/addWeeklySlots.js";
import {replaceWeeklySlot} from "../../generated/prisma/sql/replaceWeeklySlot.js";
import {PrismaClient} from "../../generated/prisma/client";
import {DbClient} from "../../shared/db";

export class DoctorsRepositoryPrisma implements IDoctorsRepository {

    constructor(private readonly prisma: PrismaClient) {
    }

    async find(filter?: DoctorFilter, db: DbClient = this.prisma): Promise<DoctorWithUser[]> {
        const where: DoctorWhereInput = {};

        if (filter?.specialization) where.specialization = {equals: filter.specialization.trim(), mode: 'insensitive'}

        if (filter?.firstName || filter?.lastName) {
            where.user = {}

            if (filter.firstName) where.user.firstName = {equals: filter.firstName.trim(), mode: 'insensitive'}
            if (filter.lastName) where.user.lastName = {equals: filter.lastName.trim(), mode: 'insensitive'}
        }

        const prismaDoctors = await db.doctor.findMany({
            where,
            select: {
                doctorId: true,
                specialization: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        role: true
                    }
                }
            },
        })

        if (filter &&
            (filter.specialization || filter.firstName || filter.lastName) &&
            prismaDoctors.length === 0) throw new Error("No doctors matched the filter")

        return prismaDoctors
    }

    async findById(doctorId: string, db: DbClient = this.prisma): Promise<DoctorWithUser | null> {
        return db.doctor.findUnique({
            where: {doctorId},
            select: {
                doctorId: true,
                specialization: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        role: true
                    }
                }
            }
        })
    }

    async create(doctorData: CreateDoctorDto, db: DbClient = this.prisma): Promise<DoctorEntity> {
        const {doctorId, specialization} = doctorData

        return db.doctor.create({
            data: {doctorId, specialization}
        })
    }

    async update(doctorId: string, doctorData: UpdateDoctorDto, db: DbClient = this.prisma): Promise<DoctorEntity> {
        const {specialization} = doctorData;

        return db.doctor.update({
            where: {doctorId},
            data: {
                specialization
            },
            select: {
                doctorId: true,
                specialization: true
            }
        })
    }

    async delete(doctorId: string, db: DbClient = this.prisma): Promise<void> {
        await db.doctor.delete({
            where: {doctorId}
        })
    }

    async getWeeklySlots(doctorId: string, db: DbClient = this.prisma): Promise<Slot[]> {
        const rows = await db.$queryRawTyped(getWeeklySlots(doctorId))

        return rows.map(r => {
            if (r.startAt === null || r.endAt === null) throw new Error(`Invalid time_range for slot ${r.id}: boundaries are NULL/infinite`)

            return {
                id: r.id,
                weekday: r.weekday,
                startAt: r.startAt,
                endAt: r.endAt
            }
        })

    }

    async addWeeklySlots(doctorId: string, slots: CreateSlotDto[], db: DbClient = this.prisma): Promise<AddWeeklySlotsResult> {
        const payload = {
            slots: slots.map(s => ({
                weekday: s.weekday,
                startAt: s.startAt.toISOString(),
                endAt: s.endAt.toISOString()
            }))
        }

        const rows = await db.$queryRawTyped(addWeeklySlots(doctorId, payload))

        const result = rows[0]
        if (!result) throw new Error('addWeeklySlots: expected 1 row')

        return result
    }

    async replaceWeeklySlot(doctorId: string, slotId: string, newSlot: CreateSlotDto, db: DbClient = this.prisma): Promise<SlotId> {
        const {weekday, startAt, endAt} = newSlot;

        const rows = await db.$queryRawTyped(
            replaceWeeklySlot(doctorId, slotId, weekday, startAt, endAt)
        )

        const row = rows[0]
        const newSlotId = row?.id

        if (!newSlotId) {
            throw new Error(`Slot ${slotId} for doctor ${doctorId} not found`)
        }

        return newSlotId as SlotId
    }

    async deleteWeeklySlot(doctorId: string, slotId: string, db: DbClient = this.prisma): Promise<void> {
        const {count} = await db.doctorWeeklySlot.deleteMany({
            where: {
                id: slotId,
                doctorId,
            },
        })

        if (count === 0) {
            throw new Error('Slot not found or does not belong to doctor')
        }
    }


}