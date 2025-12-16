import {Patient, UpdatePatientData} from "../types.js";

export interface IPatientsRepository {
    find(): Promise<Patient[]>;
    findById(id: string): Promise<Patient | undefined>;
    create(patientData: Patient): Promise<Patient>;
    update(userId: string, patientData: UpdatePatientData): Promise<Patient>;
    delete(userId: string): Promise<void>;
}