import { Injectable } from '@nestjs/common';
import {PrismaService} from "../shared/prisma/prisma.service";
import {PatientsRepositoryService} from "../shared/repositories/patients.repository.service";
import {UsersRepositoryService} from "../shared/repositories/users.repository.service";
import { PatientFilter, PatientWithUser, UpdatePatientDto } from "./patients.types";
import {DbClient} from "../shared/prisma/db-client.type";
import { UpdateUserDto } from "src/users/dto/update-user.dto";


@Injectable()
export class PatientsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly patientsRepo: PatientsRepositoryService,
        private readonly usersRepo: UsersRepositoryService
    ) {}

    async getPatients(filter: PatientFilter, db?: DbClient): Promise<PatientWithUser[]> {
        const dbClient = db ?? this.prisma
        return this.patientsRepo.find(dbClient, filter)
    }

    async getPatientById(patientId: string, db?: DbClient): Promise<PatientWithUser | null> {
        const dbClient = db ?? this.prisma
        return this.patientsRepo.findById(dbClient, patientId)
    }

    async updatePatient(patientId: string, updatePatientData: UpdatePatientDto): Promise<PatientWithUser> {
        const phone =
            updatePatientData.phone !== undefined ? updatePatientData.phone : undefined;

        const firstName = updatePatientData.firstName !== undefined ? updatePatientData.firstName.trim() : undefined;
        const lastName = updatePatientData.lastName !== undefined ? updatePatientData.lastName.trim() : undefined;

        return this.prisma.$transaction(async (tx) => {
            const patient = await this.patientsRepo.findById(tx, patientId);
            if (!patient) throw new Error("Patient not found");

            const patientPatch: { phone?: string } = {};
            if (phone !== undefined) patientPatch.phone = phone;

            const updatedPatient =
                Object.keys(patientPatch).length > 0
                    ? await this.patientsRepo.update(tx, patientId, patientPatch)
                    : patient;

            const userPatch: UpdateUserDto = {};
            if (firstName !== undefined) userPatch.firstName = firstName;
            if (lastName !== undefined) userPatch.lastName = lastName;

            const updatedUser =
                Object.keys(userPatch).length > 0
                    ? await this.usersRepo.updateProfile(tx, patientId, userPatch)
                    : await this.usersRepo.findById(tx, patientId)

            if (!updatedUser) throw new Error("User not found"); // на всякий

            return {
                patientId,
                phone: updatedPatient.phone,
                user: {
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    role: updatedUser.role,
                },
            };
        });
    }

    async deletePatient(patientId: string): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            const patient = await this.patientsRepo.findById(tx, patientId);
            if (!patient) throw new Error("Patient not found");

            await this.patientsRepo.delete(tx, patientId);
            await this.usersRepo.delete(tx, patientId);
        });
    }
}
