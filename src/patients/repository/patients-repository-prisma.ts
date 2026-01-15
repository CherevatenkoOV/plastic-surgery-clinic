import {CreatePatientDto, PatientEntity, PatientFilter, PatientWithUser, UpdatePatientDto} from "../types";
import {IPatientsRepository} from "./i-patients-repository";
import {PrismaClient} from "../../generated/prisma/client";
import {PatientWhereInput} from "../../generated/prisma/models/Patient";

export class PatientsRepositoryPrisma implements IPatientsRepository {

    constructor(private readonly prisma: PrismaClient) {
    }

    // DONE
    async find(filter?: PatientFilter): Promise<PatientWithUser[]> {
        const where: PatientWhereInput = {}

        if (filter?.phone) where.phone = filter.phone

        if (filter?.firstName || filter?.lastName) {
            where.user = {}

            if (filter.firstName) where.user.firstName = {equals: filter.firstName.trim(), mode: 'insensitive'}
            if (filter.lastName) where.user.lastName = {equals: filter.lastName.trim(), mode: 'insensitive'}
        }

        const prismaPatients = await this.prisma.patient.findMany({
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
    async findById(patientId: string): Promise<PatientWithUser | null> {
        return this.prisma.patient.findUnique({
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
    async create(patientData: CreatePatientDto): Promise<PatientEntity> {
        const {patientId, phone} = patientData

        return this.prisma.patient.create({
            data: {patientId, phone: phone}
        })
    }

    // DONE
    async update(patientId: string, patientData: UpdatePatientDto): Promise<PatientEntity> {
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

    async delete(patientId: string): Promise<void> {
        await this.prisma.patient.delete({
            where: {patientId}
        })
    }
}