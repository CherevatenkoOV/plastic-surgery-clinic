import {
    CreateDoctorDto, CreateSlotDto,
    DoctorEntity,
    DoctorsQueryDto, Slot,
    UpdateDoctorDto
} from "../types.js";

export interface IDoctorsRepository {
    find(filter?: DoctorsQueryDto): Promise<DoctorEntity[]>;
    findById(doctorId: string): Promise<DoctorEntity | null>;
    create(doctorData: CreateDoctorDto): Promise<DoctorEntity>;
    update(doctorId: string, doctorData: UpdateDoctorDto): Promise<DoctorEntity>;
    delete(doctorId: string): Promise<void>;
    getWeeklySlots(doctorId: string): Promise<Slot[]>;
    addWeeklySlots(doctorId: string, slots: CreateSlotDto[]): Promise<void[]>;
    replaceWeeklySlot(doctorId: string, slotId: string, newSlot: CreateSlotDto): Promise<void>;
    deleteWeeklySlot(doctorId: string, slotId: string): Promise<void>
}