import {IUsersRepository} from "./i-users-repository";
import {CreateUserDto, CredentialsDto, UpdateUserDto, UserEntity, UserFilter} from "../types";
import {UserWhereInput} from "../../generated/prisma/models/User";
import {PrismaClient} from "../../generated/prisma/client";

export class UsersRepositoryPrisma implements IUsersRepository {

    constructor(private readonly prisma: PrismaClient) {}

    // DONE
    async find(filter?: UserFilter): Promise<UserEntity[]> {
        const where: UserWhereInput = {};

        if (filter?.firstName) where.firstName = {equals: filter.firstName.trim(), mode: 'insensitive'}

        if (filter?.lastName) where.lastName = {equals: filter.lastName.trim(), mode: 'insensitive'}


        const prismaUsers = await this.prisma.user.findMany({
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
    async findById(id: string): Promise<UserEntity | null> {
        return this.prisma.user.findUnique({
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
    async findByEmail(email: string): Promise<UserEntity | null> {
        const authRow = await this.prisma.userAuth.findUnique({
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
    async create(userData: CreateUserDto): Promise<UserEntity> {
        const {firstName, lastName, role, auth: {email, passwordHash}} = userData;

        return this.prisma.user.create({
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
    async updateProfile(id: string, data: UpdateUserDto): Promise<UserEntity> {
        const {firstName, lastName} = data;

        return this.prisma.user.update({
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

    async updateCredentials(id: string, credentials: CredentialsDto): Promise<void> {
            const {email, passwordHash, refreshToken} = credentials;
            await this.prisma.userAuth.update({
                where: {userId: id},
                data: {
                   email,
                   passwordHash,
                   refreshToken
                }
            })
    }

    async delete(id: string): Promise<void> {
        await this.prisma.user.delete({
            where: {id}
        })
    }
}