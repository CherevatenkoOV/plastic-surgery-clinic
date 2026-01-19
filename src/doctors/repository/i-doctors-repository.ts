import {
    CreateDoctorDto, CreateSlotDto,
    DoctorEntity,
    DoctorFilter, Slot,
    UpdateDoctorDto
} from "../types.js";
import {DbClient} from "../../shared/db";

export interface IDoctorsRepository {
    find(filter?: DoctorFilter, db?: DbClient): Promise<DoctorEntity[]>;
    findById(doctorId: string, db?: DbClient): Promise<DoctorEntity | null>;
    create(doctorData: CreateDoctorDto, db: DbClient): Promise<DoctorEntity>;
    update(doctorId: string, doctorData: UpdateDoctorDto, db: DbClient): Promise<DoctorEntity>;
    delete(doctorId: string, db: DbClient): Promise<void>;
    getWeeklySlots(doctorId: string, db?: DbClient): Promise<Slot[]>;
    addWeeklySlots(doctorId: string, slots: CreateSlotDto[], db?: DbClient): Promise<void[]>;
    replaceWeeklySlot(doctorId: string, slotId: string, newSlot: CreateSlotDto, db?: DbClient): Promise<void>;
    deleteWeeklySlot(doctorId: string, slotId: string, db: DbClient): Promise<void>
}