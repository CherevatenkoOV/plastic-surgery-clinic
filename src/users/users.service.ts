import {Injectable, NotFoundException} from '@nestjs/common';
import { UserPublic} from "./users.types";
import type {DbClient} from "../shared/prisma/db-client.type";
import type {UpdateUserDto} from "./dto/update-user.dto";
import {PrismaService} from "../shared/prisma/prisma.service";
import {UsersRepositoryService} from "./users.repository.service";
import {GetUsersQueryDto} from "./dto/get-users-query.dto";
import {UserMapper} from "./dto/user.mapper";

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

    async updateById(id: string, userData: UpdateUserDto, db?: DbClient): Promise<UserPublic> {
        const dbClient = db ?? this.prisma
        const user = await this.usersRepo.updateProfile(dbClient, id, userData)

        if (!user) throw new NotFoundException("User not found")

        return UserMapper.toPublic(user)
    }

    async deleteById(id: string, db?: DbClient): Promise<void> {
        const dbClient = db ?? this.prisma

        await this.usersRepo.delete(dbClient, id)
    }

}
