import {IDoctorsRepository} from "./i-doctors-repository.js";
import {
    AddWeeklySlotsResult,
    CreateDoctorDto, CreateSlotDto,
    DoctorEntity,
    DoctorsQueryDto,
    Slot, SlotId,
    UpdateDoctorDto
} from "../types.js";
import {DoctorWhereInput} from "../../generated/prisma/models/Doctor";
import {getWeeklySlots} from "../../generated/prisma/sql/getWeeklySlots.js";
import {addWeeklySlots} from "../../generated/prisma/sql/addWeeklySlots.js";
import { replaceWeeklySlot } from "../../generated/prisma/sql/replaceWeeklySlot.js";
import {PrismaClient} from "../../generated/prisma/client";

export class DoctorsRepositoryFile implements IDoctorsRepository {

    constructor(private readonly prisma: PrismaClient) {}

    // DONE
    async find(filter?: DoctorsQueryDto): Promise<DoctorEntity[]> {
        const where: DoctorWhereInput = {};

        if (filter?.specialization) where.specialization = {equals: filter?.specialization?.trim(), mode: 'insensitive'}

        const prismaDoctors = await this.prisma.doctor.findMany({
            where,
            select: {
                doctorId: true,
                specialization: true
            }
        })

        if (filter && filter.specialization && prismaDoctors.length === 0) throw new Error("No users matched the filter")

        return prismaDoctors
    }

    // DONE
    async findById(doctorId: string): Promise<DoctorEntity | null> {
        return this.prisma.doctor.findUnique({
            where: {doctorId},
            select: {
                doctorId: true,
                specialization: true
            }
        })
    }

    // DONE
    async create(doctorData: CreateDoctorDto): Promise<DoctorEntity> {
        const {doctorId, specialization} = doctorData

        return this.prisma.doctor.create({
            data: {doctorId, specialization}
        })
    }

    // DONE
    async update(doctorId: string, doctorData: UpdateDoctorDto): Promise<DoctorEntity> {
        const {specialization} = doctorData;

        return this.prisma.doctor.update({
            where: {doctorId},
            data: {
                specialization
            }
        })
    }

    // DONE
    async delete(doctorId: string): Promise<void> {
        await this.prisma.doctor.delete({
            where: {doctorId}
        })
    }

    // DONE
    async getWeeklySlots(doctorId: string): Promise<Slot[]> {
        const rows = await this.prisma.$queryRawTyped(getWeeklySlots(doctorId))

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

    // DONE
    async addWeeklySlots(doctorId: string, slots: CreateSlotDto[]): Promise<AddWeeklySlotsResult> {
        const payload = {
            slots: slots.map(s => ({
                weekday: s.weekday,
                startAt: s.startAt.toISOString(),
                endAt: s.endAt.toISOString()
            }))
        }

        const rows = await this.prisma.$queryRawTyped(addWeeklySlots(doctorId, payload))

        const result = rows[0]
        if (!result) throw new Error('addWeeklySlots: expected 1 row')

        return result
    }

    // DONE
    async replaceWeeklySlot(doctorId: string, slotId: string, newSlot: CreateSlotDto): Promise<SlotId> {
        const {weekday, startAt, endAt} = newSlot;

        const rows = await this.prisma.$queryRawTyped(
            replaceWeeklySlot(doctorId, slotId, weekday, startAt, endAt)
        )

        const row = rows[0]
        const newSlotId = row?.id

        if (!newSlotId) {
            throw new Error(`Slot ${slotId} for doctor ${doctorId} not found`)
        }

        return newSlotId as SlotId
    }

    async deleteWeeklySlot(doctorId: string, slotId: string): Promise<void> {
        const { count } = await this.prisma.doctorWeeklySlot.deleteMany({
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