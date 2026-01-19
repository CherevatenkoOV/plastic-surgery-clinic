import {PrismaClient} from "../generated/prisma/client";
import {IDoctorsRepository} from "./repository/i-doctors-repository";
import { UpdateUserDto} from "../users";
import { DoctorFilter, DoctorWithUser, UpdateDoctorDto} from "./types";
import {IUsersRepository} from "../users/repository/i-users-repository";

export class DoctorsFlow {
    constructor(
        private readonly prisma: PrismaClient,
        private readonly doctorsRepo: IDoctorsRepository,
        private readonly usersRepo: IUsersRepository
    ) {
    }

    // TODO: could expand by weekly slots
    async getDoctors(filter?: DoctorFilter): Promise<DoctorWithUser[]> {
        return this.doctorsRepo.find(filter);
    }

    // TODO: could expand by weekly slots
    async getDoctorById(doctorId: string): Promise<DoctorWithUser | null> {
        return this.doctorsRepo.findById(doctorId);
    }

    async updateDoctor(doctorId: string, updateDoctorData: UpdateDoctorDto): Promise<DoctorWithUser> {
        const specialization =
            updateDoctorData.specialization !== undefined ? updateDoctorData.specialization.trim() : undefined;

        const firstName = updateDoctorData.firstName !== undefined ? updateDoctorData.firstName.trim() : undefined;
        const lastName = updateDoctorData.lastName !== undefined ? updateDoctorData.lastName.trim() : undefined;

        return this.prisma.$transaction(async (tx) => {
            const doctor = await this.doctorsRepo.findById(doctorId, tx);
            if (!doctor) throw new Error("Doctor not found");

            const doctorPatch: { specialization?: string } = {};
            if (specialization !== undefined) doctorPatch.specialization = specialization;

            const updatedDoctor =
                Object.keys(doctorPatch).length > 0
                    ? await this.doctorsRepo.update(doctorId, doctorPatch, tx)
                    : doctor;

            const userPatch: UpdateUserDto = {};
            if (firstName !== undefined) userPatch.firstName = firstName;
            if (lastName !== undefined) userPatch.lastName = lastName;

            const updatedUser =
                Object.keys(userPatch).length > 0
                    ? await this.usersRepo.updateProfile(doctorId, userPatch, tx)
                    : await this.usersRepo.findById(doctorId, tx)

            if (!updatedUser) throw new Error("User not found"); // на всякий

            return {
                doctorId,
                specialization: updatedDoctor.specialization,
                user: {
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    role: updatedUser.role,
                },
            };
        });
    }

    async deleteDoctor(doctorId: string): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            const doctor = await this.doctorsRepo.findById(doctorId, tx);
            if (!doctor) throw new Error("Doctor not found");

            await this.doctorsRepo.delete(doctorId, tx);
            await this.usersRepo.delete(doctorId, tx);
        });
    }
}