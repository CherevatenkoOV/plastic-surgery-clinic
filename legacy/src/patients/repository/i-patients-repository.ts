import {CreatePatientDto, PatientEntity, PatientFilter, PatientWithUser, UpdatePatientDto} from "../types.js";
import {DbClient} from "../../shared/db";

export interface IPatientsRepository {
    find(filter?: PatientFilter, db?: DbClient): Promise<PatientWithUser[]>;
    findById(patientId: string, db?: DbClient): Promise<PatientWithUser | null>;
    create(patientData: CreatePatientDto, db: DbClient): Promise<PatientEntity>;
    update(patientId: string, patientData: UpdatePatientDto, db: DbClient): Promise<PatientEntity>;
    delete(patientId: string, db: DbClient): Promise<void>;
}