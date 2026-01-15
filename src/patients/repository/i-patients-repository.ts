import {CreatePatientDto, Patient, PatientEntity, PatientWithUser, UpdatePatientDto} from "../types.js";

export interface IPatientsRepository {
    find(): Promise<PatientWithUser[]>;
    findById(patientId: string): Promise<PatientWithUser | null>;
    create(patientData: CreatePatientDto): Promise<PatientEntity>;
    update(patientId: string, patientData: UpdatePatientDto): Promise<PatientEntity>;
    delete(patientId: string): Promise<void>;
}