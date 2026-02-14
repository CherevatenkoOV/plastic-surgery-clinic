import {Injectable, NotFoundException} from "@nestjs/common";
import {DoctorsRepositoryService} from "./doctors.repository.service";
import {UsersRepositoryService} from "../users/users.repository.service";
import { DoctorFilter, DoctorWithUser } from "./doctors.types";
import { DbClient } from "src/shared/prisma/db-client.type";
import { UpdateUserDto } from "src/users/dto/update-user.dto";
import { UpdateDoctorDto } from "./dto/update-doctor.dto";
import {PrismaService} from "../shared/prisma/prisma.service";


@Injectable()
export class DoctorsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly doctorsRepo: DoctorsRepositoryService,
        private readonly usersRepo: UsersRepositoryService
    ) {
    }

    async getMany(filter: DoctorFilter, db?: DbClient): Promise<DoctorWithUser[]> {
        const dbClient = db ?? this.prisma
        return this.doctorsRepo.find(dbClient, filter);
    }

    async getById(doctorId: string, db?: DbClient): Promise<DoctorWithUser> {
        const dbClient = db ?? this.prisma
        const doctor = await this.doctorsRepo.findById(dbClient, doctorId);

        if(!doctor) throw new NotFoundException('Doctor with specified id was not found')

        return doctor
    }

    async updateById(doctorId: string, updateDoctorData: UpdateDoctorDto): Promise<DoctorWithUser> {
        const specialization =
            updateDoctorData.specialization !== undefined ? updateDoctorData.specialization.trim() : undefined;

        const firstName = updateDoctorData.firstName !== undefined ? updateDoctorData.firstName.trim() : undefined;
        const lastName = updateDoctorData.lastName !== undefined ? updateDoctorData.lastName.trim() : undefined;

        return this.prisma.$transaction(async (tx) => {
            const doctor = await this.doctorsRepo.findById(tx, doctorId);
            if(!doctor) throw new NotFoundException('Doctor with specified id was not found')

            const doctorPatch: { specialization?: string } = {};
            if (specialization !== undefined) doctorPatch.specialization = specialization;

            const updatedDoctor =
                Object.keys(doctorPatch).length > 0
                    ? await this.doctorsRepo.update(tx, doctorId, doctorPatch)
                    : doctor;

            const userPatch: UpdateUserDto = {};
            if (firstName !== undefined) userPatch.firstName = firstName;
            if (lastName !== undefined) userPatch.lastName = lastName;

            const updatedUser =
                Object.keys(userPatch).length > 0
                    ? await this.usersRepo.updateProfile(tx, doctorId, userPatch)
                    : await this.usersRepo.findById(tx, doctorId)

            if(!updatedUser) throw new NotFoundException('User with specified id was not found')

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

    async deleteById(doctorId: string): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            const doctor = await this.doctorsRepo.findById(tx, doctorId);
            if(!doctor) throw new NotFoundException('Doctor with specified id was not found')

            await this.doctorsRepo.delete(tx, doctorId);
            await this.usersRepo.delete(tx, doctorId);
        });
    }
}