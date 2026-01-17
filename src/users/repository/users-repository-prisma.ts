import {IUsersRepository} from "./i-users-repository";
import {
    CreateUserDto,
    UpdateUserCredentialsDto,
    UpdateUserDto,
    UserAuthSubject,
    UserEntity,
    UserFilter
} from "../types";
import {UserWhereInput} from "../../generated/prisma/models/User";
import {PrismaClient} from "../../generated/prisma/client";
import {DbClient} from "../../shared/db";

export class UsersRepositoryPrisma implements IUsersRepository {

    constructor(private readonly prisma: PrismaClient) {}

    // DONE
    async find(filter?: UserFilter, db: DbClient = this.prisma): Promise<UserEntity[]> {
        const where: UserWhereInput = {};

        if (filter?.firstName) where.firstName = {equals: filter.firstName.trim(), mode: 'insensitive'}

        if (filter?.lastName) where.lastName = {equals: filter.lastName.trim(), mode: 'insensitive'}


        const prismaUsers = await db.user.findMany({
            where,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        })

        if (filter && (filter.firstName || filter.lastName) && prismaUsers.length === 0) throw new Error("No users matched the filter")

        return prismaUsers
    }

    // DONE
    async findById(id: string, db: DbClient = this.prisma): Promise<UserEntity | null> {
        return db.user.findUnique({
            where: {id},
            select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        })
    }

    // DONE
    //TODO:  if you need email -> create method getCredentialsByEmail
    async findByEmail(email: string, db: DbClient = this.prisma): Promise<UserEntity | null> {
        const authRow = await db.userAuth.findUnique({
            where: {email},
            select: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }
            }
        })


        return authRow?.user ?? null
    }

    // DONE
    async create(userData: CreateUserDto, db: DbClient = this.prisma): Promise<UserEntity> {
        const {firstName, lastName, role, auth: {email, passwordHash}} = userData;

        return db.user.create({
            data: {
                firstName,
                lastName,
                role,
                userAuth: {
                    create: {
                        email,
                        passwordHash
                    }
                }
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        })
    }

    // DONE
    async getAuthSubjectById(id: string, db: DbClient = this.prisma): Promise<UserAuthSubject | null> {
        const authRow = await db.userAuth.findUnique({
            where: {userId: id},
            select: {
                user: { select: {id: true, role: true } },
                email: true,
                passwordHash: true,
                refreshToken: true
            }
        })

        if (!authRow) return null;
        if (!authRow.user) throw new Error("Corrupted auth record: user not found");

        return {
            id: authRow.user.id,
            role: authRow.user.role,
            email: authRow.email,
            passwordHash: authRow.passwordHash,
            refreshToken: authRow.refreshToken
        }
    }

    // DONE
    async getAuthSubjectByEmail(email: string, db: DbClient = this.prisma): Promise<UserAuthSubject | null> {
        const authRow = await db.userAuth.findUnique({
            where: {email},
            select: {
                user: { select: {id: true, role: true } },
                email: true,
                passwordHash: true,
                refreshToken: true
            }
        })

        if (!authRow) return null;
        if (!authRow.user) throw new Error("Corrupted auth record: user not found");

        return {
            id: authRow.user.id,
            role: authRow.user.role,
            email: authRow.email,
            passwordHash: authRow.passwordHash,
            refreshToken: authRow.refreshToken
        }
    }

    // DONE
    async updateProfile(id: string, data: UpdateUserDto, db: DbClient = this.prisma): Promise<UserEntity> {
        const {firstName, lastName} = data;

        return db.user.update({
            where : {id},
            data: {firstName, lastName},
            select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        })
    }

    async updateCredentials(id: string, credentials: UpdateUserCredentialsDto, db: DbClient = this.prisma): Promise<void> {
            const {email, passwordHash, refreshToken} = credentials;
            await db.userAuth.update({
                where: {userId: id},
                data: {
                   email,
                   passwordHash,
                   refreshToken
                }
            })
    }

    async delete(id: string, db: DbClient = this.prisma): Promise<void> {
        await db.user.delete({
            where: {id}
        })
    }
}