import {Injectable, NotFoundException} from '@nestjs/common';
import {UserAuthRecord, UserPublic} from "./users.types";
import type {DbClient} from "../shared/prisma/db-client.type";
import type {UpdateUserDto} from "./dto/update-user.dto";
import {PrismaService} from "../shared/prisma/prisma.service";
import {UsersRepositoryService} from "../shared/repositories/users.repository.service";
import {GetUsersQueryDto} from "./dto/get-users-query.dto";
import {UserMapper} from "./dto/user.mapper";

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

    async getMany(dto: GetUsersQueryDto, db?: DbClient): Promise<UserPublic[]> {
        const dbClient = db ?? this.prisma
        const users = await this.usersRepo.find(dbClient, dto)
        return UserMapper.toPublicList(users)
    }

    async getById(id: string, db?: DbClient): Promise<UserPublic> {
        const dbClient = db ?? this.prisma
        const user =  await this.usersRepo.findById(dbClient, id)

        if (!user) throw new NotFoundException("User not found")

        return UserMapper.toPublic(user)
    }

    async getByEmail(email: string, db?: DbClient): Promise<UserPublic> {
        const dbClient = db ?? this.prisma
        const user = await this.usersRepo.findByEmail(dbClient, email)

        if (!user) throw new NotFoundException("User not found")

        return UserMapper.toPublic(user)
    }

    async update(id: string, userData: UpdateUserDto, db?: DbClient): Promise<UserPublic> {
        const dbClient = db ?? this.prisma
        const user = await this.usersRepo.updateProfile(dbClient, id, userData)

        if (!user) throw new NotFoundException("User not found")

        return UserMapper.toPublic(user)
    }

    async delete( id: string, db?: DbClient): Promise<void> {
        const dbClient = db ?? this.prisma

        await this.usersRepo.delete(dbClient, id)
    }

    async getAuthSubjectByEmail(email: string, db?: DbClient): Promise<UserAuthRecord | null> {
        const dbClient = db ?? this.prisma
        return this.usersRepo.getAuthSubjectByEmail(dbClient, email);
    }
}
