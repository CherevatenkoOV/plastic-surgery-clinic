import {Injectable} from '@nestjs/common';
import {DbClient} from "../prisma/db-client.type";
import {CreatePatientDto, PatientEntity, PatientFilter, PatientWithUser, UpdatePatientDto} from "src/patients/patients.types";
import {PatientWhereInput} from "src/generated/prisma/models";

@Injectable()
export class PatientsRepositoryService {
    async find(db: DbClient, filter?: PatientFilter): Promise<PatientWithUser[]> {
        const where: PatientWhereInput = {}

        if (filter?.phone) where.phone = filter.phone

        if (filter?.firstName || filter?.lastName) {
            where.user = {}

            if (filter.firstName) where.user.firstName = {equals: filter.firstName.trim(), mode: 'insensitive'}
            if (filter.lastName) where.user.lastName = {equals: filter.lastName.trim(), mode: 'insensitive'}
        }

        return db.patient.findMany({
            where,
            select: {
                patientId: true,
                phone: true,
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
    }

    async findById(db: DbClient, patientId: string): Promise<PatientWithUser | null> {
        return db.patient.findUnique({
            where: {patientId},
            select: {
                patientId: true,
                phone: true,
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

    async create(db: DbClient, patientData: CreatePatientDto): Promise<PatientEntity> {
        const {patientId, phone} = patientData

        return db.patient.create({
            data: {patientId, phone}
        })
    }

    async update(db: DbClient, patientId: string, patientData: UpdatePatientDto): Promise<PatientEntity> {
        const {phone} = patientData;

        return db.patient.update({
            where: {patientId},
            data: {phone},
            select: {
                patientId: true,
                phone: true,
            }
        })
    }

    async delete(db: DbClient, patientId: string): Promise<void> {
        await db.patient.delete({
            where: {patientId}
        })
    }
}
