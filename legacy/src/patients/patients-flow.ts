import {PrismaClient} from "../generated/prisma/client";
import {IPatientsRepository} from "./repository/i-patients-repository";
import {IUsersRepository, UpdateUserDto} from "../users";
import {PatientFilter, PatientWithUser, UpdatePatientDto} from "./types";

export class PatientsFlow {
    constructor(
        private readonly prisma: PrismaClient,
        private readonly patientsRepo: IPatientsRepository,
        private readonly usersRepo: IUsersRepository
    ) {
    }

    async getPatients(filter?: PatientFilter): Promise<PatientWithUser[]> {
        return this.patientsRepo.find(filter, this.prisma)
    }

    async getPatientById(patientId: string): Promise<PatientWithUser | null> {
        return this.patientsRepo.findById(patientId, this.prisma)
    }

    async updatePatient(patientId: string, updatePatientData: UpdatePatientDto): Promise<PatientWithUser> {
        const phone =
            updatePatientData.phone !== undefined ? updatePatientData.phone : undefined;

        const firstName = updatePatientData.firstName !== undefined ? updatePatientData.firstName.trim() : undefined;
        const lastName = updatePatientData.lastName !== undefined ? updatePatientData.lastName.trim() : undefined;

        return this.prisma.$transaction(async (tx) => {
            const patient = await this.patientsRepo.findById(patientId, tx);
            if (!patient) throw new Error("Patient not found");

            const patientPatch: { phone?: string } = {};
            if (phone !== undefined) patientPatch.phone = phone;

            const updatedPatient =
                Object.keys(patientPatch).length > 0
                    ? await this.patientsRepo.update(patientId, patientPatch, tx)
                    : patient;

            const userPatch: UpdateUserDto = {};
            if (firstName !== undefined) userPatch.firstName = firstName;
            if (lastName !== undefined) userPatch.lastName = lastName;

            const updatedUser =
                Object.keys(userPatch).length > 0
                    ? await this.usersRepo.updateProfile(patientId, userPatch, tx)
                    : await this.usersRepo.findById(patientId, tx)

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
            const patient = await this.patientsRepo.findById(patientId, tx);
            if (!patient) throw new Error("Patient not found");

            await this.patientsRepo.delete(patientId, tx);
            await this.usersRepo.delete(patientId, tx);
        });
    }

}