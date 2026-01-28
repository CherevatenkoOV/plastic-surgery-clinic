import {Injectable, NotFoundException} from '@nestjs/common';
import type {UserEntity, UserFilter} from "./users.types";
import type {DbClient} from "../shared/prisma/db-client.type";
import type {UpdateUserDto} from "./dto/update-user.dto";
import {PrismaService} from "../shared/prisma/prisma.service";
import {UsersRepositoryService} from "./users.repository.service";

/*
 1. Обработка ошибок вынесена из репозитория в сервис
 */

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly usersRepo: UsersRepositoryService
    ) {
    }

    async get(filter?: UserFilter, db?: DbClient): Promise<UserEntity[]> {
        const dbClient = db ?? this.prisma
        const users = await this.usersRepo.find(dbClient, filter)

        return users
    }

    async getById(id: string, db?: DbClient): Promise<UserEntity | null> {
        const dbClient = db ?? this.prisma
        const user =  await this.usersRepo.findById(dbClient, id)

        if (!user) throw new NotFoundException("User not found")

        return user
    }

    async getByEmail(email: string, db?: DbClient): Promise<UserEntity | null> {
        const dbClient = db ?? this.prisma
        const user = await this.usersRepo.findByEmail(dbClient, email)

        if (!user) throw new NotFoundException("User not found")

        return user
    }

    async update(id: string, userData: UpdateUserDto, db?: DbClient): Promise<UserEntity | null> {
        const dbClient = db ?? this.prisma
        const user = await this.usersRepo.updateProfile(dbClient, id, userData)

        if (!user) throw new NotFoundException("User not found")

        return user
    }

    async delete( id: string, db?: DbClient): Promise<void> {
        const dbClient = db ?? this.prisma

        await this.usersRepo.delete(dbClient, id)
    }
}
