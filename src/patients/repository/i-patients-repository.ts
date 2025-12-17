import {CreatePatientDto, Patient, UpdatePatientDto} from "../types.js";

export interface IPatientsRepository {
    find(): Promise<Patient[]>;
    findById(id: string): Promise<Patient | undefined>;
    create(patientData: CreatePatientDto): Promise<Patient>;
    update(userId: string, patientData: UpdatePatientDto): Promise<Patient>;
    delete(userId: string): Promise<void>;
}