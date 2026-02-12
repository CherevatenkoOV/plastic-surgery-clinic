import {Injectable} from '@nestjs/common';
import {
    CreateUserInput,
    UpdateUserCredentialsInput,
    UpdateUserInput,
    UserAuthSubject,
    UserEntity,
    UserFilter
} from "../../users/users.types";
import {DbClient} from "src/shared/prisma/db-client.type";
import {UserWhereInput} from "src/generated/prisma/models";

@Injectable()
export class UsersRepositoryService {

    async find(db: DbClient, filter?: UserFilter): Promise<UserEntity[]> {
        const where: UserWhereInput = {};

        if (filter?.firstName) where.firstName = {equals: filter.firstName.trim(), mode: 'insensitive'}

        if (filter?.lastName) where.lastName = {equals: filter.lastName.trim(), mode: 'insensitive'}

        return db.user.findMany({
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
    }

    async findById(db: DbClient, id: string): Promise<UserEntity | null> {
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

    async findByEmail(db: DbClient, email: string): Promise<UserEntity | null> {
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

    async create(db: DbClient, userData: CreateUserInput): Promise<UserEntity> {
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

    // TODO: probably should be removed
    async getAuthSubjectByUserId(db: DbClient, userId: string): Promise<UserAuthSubject | null> {
        const authRow = await db.userAuth.findUnique({
            where: {userId},
            select: {
                user: {select: {id: true, role: true}},
                email: true,
                passwordHash: true,
                refreshToken: true
            }
        })

        if (!authRow?.user) return null

        return {
            id: authRow.user.id,
            role: authRow.user.role,
            email: authRow.email,
            passwordHash: authRow.passwordHash,
            refreshToken: authRow.refreshToken
        }
    }

    async getAuthSubjectByEmail(db: DbClient, email: string): Promise<UserAuthSubject | null> {
        const authRow = await db.userAuth.findUnique({
            where: {email},
            select: {
                user: {select: {id: true, role: true}},
                email: true,
                passwordHash: true,
                refreshToken: true
            }
        })

        if (!authRow?.user) return null

        return {
            id: authRow.user.id,
            role: authRow.user.role,
            email: authRow.email,
            passwordHash: authRow.passwordHash,
            refreshToken: authRow.refreshToken
        }
    }

    // ОШИБКА: ПРИНИМАЕТ AUTH внутри data: UpdateUserDto, ПО СУТИ ЭТО ЛИШНЕЕ
    async updateProfile(db: DbClient, id: string, data: UpdateUserInput): Promise<UserEntity | null> {
        const {firstName, lastName} = data;

        const user = db.user.update({
            where: {id},
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

        if(!user) return null

        return user
    }

    // async updateCredentials(db: DbClient, id: string, credentials: UpdateUserCredentialsInput): Promise<void> {
    //     const {email, passwordHash, refreshToken} = credentials;
    //     await db.userAuth.update({
    //         where: {userId: id},
    //         data: {
    //             email,
    //             passwordHash,
    //             refreshToken
    //         }
    //     })
    // }

    async updateCredentials(db: DbClient, id: string, credentials: UpdateUserCredentialsInput): Promise<void> {
        const data: any = {};

        if (credentials.email !== undefined) {
            data.email = credentials.email;
        }

        if (credentials.passwordHash !== undefined) {
            data.passwordHash = credentials.passwordHash;
        }

        if (credentials.refreshToken !== undefined) {
            data.refreshToken = credentials.refreshToken;
        }

        await db.userAuth.update({
            where: {userId: id},
            data
        })
    }

    async delete(db: DbClient, id: string): Promise<void> {
        await db.user.delete({
            where: {id}
        })
    }
}
