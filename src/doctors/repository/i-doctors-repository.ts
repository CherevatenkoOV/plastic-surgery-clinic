import {Doctor, DoctorsQueryDto, UpdateDoctorDto} from "../types.js";

export interface IDoctorsRepository {
    find(filter?: DoctorsQueryDto): Promise<Doctor[]>;
    findById(id: string): Promise<Doctor | undefined>;
    create(doctorData: Doctor): Promise<Doctor>;
    update(userId: string, doctorData: UpdateDoctorDto): Promise<Doctor>;
    delete(userId: string): Promise<void>;
}