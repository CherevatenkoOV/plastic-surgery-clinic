import {Injectable} from "@nestjs/common";
import {DbClient} from "../prisma/db-client.type";
import {AddWeeklySlotsResult, CreateDoctorDto, CreateSlotDto, DoctorEntity, DoctorFilter, DoctorWithUser, Slot,
    SlotId, UpdateDoctorDto } from "src/doctors/types";
import { DoctorWhereInput } from "src/generated/prisma/models";
import {addWeeklySlots, getWeeklySlots, replaceWeeklySlot } from "legacy/src/generated/prisma/sql";

@Injectable()
export class DoctorsRepositoryService {

    async find(db: DbClient, filter?: DoctorFilter): Promise<DoctorWithUser[]> {
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

    async findById(db: DbClient, doctorId: string): Promise<DoctorWithUser | null> {
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

    async create(db: DbClient, doctorData: CreateDoctorDto): Promise<DoctorEntity> {
        const {doctorId, specialization} = doctorData

        return db.doctor.create({
            data: {doctorId, specialization}
        })
    }

    async update(db: DbClient, doctorId: string, doctorData: UpdateDoctorDto): Promise<DoctorEntity> {
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

    async delete(db: DbClient, doctorId: string): Promise<void> {
        await db.doctor.delete({
            where: {doctorId}
        })
    }

    async getWeeklySlots(db: DbClient, doctorId: string): Promise<Slot[]> {
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

    async addWeeklySlots(db: DbClient, doctorId: string, slots: CreateSlotDto[]): Promise<AddWeeklySlotsResult> {
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

    async replaceWeeklySlot(db: DbClient, doctorId: string, slotId: string, newSlot: CreateSlotDto): Promise<SlotId> {
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

    async deleteWeeklySlot(db: DbClient, doctorId: string, slotId: string): Promise<void> {
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