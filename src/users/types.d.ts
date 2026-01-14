// TODO: UserEntity для работы до слоя HTTP, дальше - оставить UserDto
import {UserRole} from "../generated/prisma/enums";
import {User} from "../generated/prisma/client";

export type UserEntity = User

export interface UserDto {
    id: string;
    firstName: string;
    lastName: sring;
    role: UserRole;
}

export type UsersParams = Pick<UserEntity, 'id'>

export interface CreateUserDto {
    firstName: string;
    lastName: string;
    role: UserRole;
    auth: {
        email: string;
        passwordHash: string;
    }
}

export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    auth?: {
        email?: string;
        passwordHash?: string;
        refreshToken?: string;
    }
}

export type UserFilter = Partial<Pick<UserEntity, "firstName" | "lastName">>

export interface CreateCredentialsDto {
    email: string;
    passwordHash: string;
}

export interface CredentialsDto {
    email?: string;
    passwordHash?: string;
    refreshToken?: string;
}


