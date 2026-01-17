import {CreatePatientDto, PatientEntity, PatientFilter, PatientWithUser, UpdatePatientDto} from "../types";
import {IPatientsRepository} from "./i-patients-repository";
import {PrismaClient} from "../../generated/prisma/client";
import {PatientWhereInput} from "../../generated/prisma/models/Patient";
import {DbClient} from "../../shared/db";

export class PatientsRepositoryPrisma implements IPatientsRepository {

    constructor(private readonly prisma: PrismaClient) {
    }

    // DONE
    async find(filter?: PatientFilter, db: DbClient = this.prisma): Promise<PatientWithUser[]> {
        const where: PatientWhereInput = {}

        if (filter?.phone) where.phone = filter.phone

        if (filter?.firstName || filter?.lastName) {
            where.user = {}

            if (filter.firstName) where.user.firstName = {equals: filter.firstName.trim(), mode: 'insensitive'}
            if (filter.lastName) where.user.lastName = {equals: filter.lastName.trim(), mode: 'insensitive'}
        }

        const prismaPatients = await db.patient.findMany({
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

        if (filter &&
            (filter.phone || filter.firstName || filter.lastName) &&
            prismaPatients.length === 0) throw new Error("No patients matched the filter")

        return prismaPatients
    }

    // DONE
    async findById(patientId: string, db: DbClient = this.prisma): Promise<PatientWithUser | null> {
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

    // DONE
    async create(patientData: CreatePatientDto, db: DbClient = this.prisma): Promise<PatientEntity> {
        const {patientId, phone} = patientData

        return db.patient.create({
            data: {patientId, phone}
        })
    }

    // DONE
    async update(patientId: string, patientData: UpdatePatientDto, db: DbClient = this.prisma): Promise<PatientEntity> {
        const {phone} = patientData;

        return this.prisma.patient.update({
            where: {patientId},
            data: {phone},
            select: {
                patientId: true,
                phone: true,
            }
        })
    }

    async delete(patientId: string, db: DbClient = this.prisma): Promise<void> {
        await db.patient.delete({
            where: {patientId}
        })
    }
}