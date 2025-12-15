import {Doctor, DoctorsQueryDto, UpdateDoctorData} from "../types.js";

export interface IDoctorsRepository {
    find(filter?: DoctorsQueryDto): Promise<Doctor[]>;
    findById(id: string): Promise<Doctor | undefined>;
    create(doctorData: Doctor): Promise<Doctor>;
    update(userId: string, doctorData: UpdateDoctorData): Promise<Doctor>;
    delete(userId: string): Promise<void>;
}