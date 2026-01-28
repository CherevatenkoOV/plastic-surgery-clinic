import {UpdateUserDto, UserEntity, UserFilter} from "./types.js";
import {IUsersRepository} from "./repository/i-users-repository.js";
import {PrismaClient} from "../generated/prisma/client";

export class UsersFlow {
    constructor(
        private readonly prisma: PrismaClient,
        private readonly usersRepo: IUsersRepository
    ) {}

    async get(filter?: UserFilter): Promise<UserEntity[]> {
        return await this.usersRepo.find(filter)
    }

    async getById(id: string): Promise<UserEntity | null> {
        return await this.usersRepo.findById(id)
    }

    async getByEmail(email: string): Promise<UserEntity | null> {
        return await this.usersRepo.findByEmail(email)
    }

    async update(id: string, userData: UpdateUserDto): Promise<UserEntity | undefined> {
       return await this.usersRepo.updateProfile(id, userData, this.prisma)
    }

    async delete(id: string): Promise<void> {
        await this.usersRepo.delete(id, this.prisma)
    }
}





