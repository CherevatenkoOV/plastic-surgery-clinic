// TODO: UserEntity для работы до слоя HTTP, дальше - оставить UserDto
import {UserRole} from "../generated/prisma/enums";
import {User} from "../generated/prisma/client";

export type UserEntity = Prisma.UserGetPayload<{
    select: {
        id: true;
        firstName: true;
        lastName: true;
        role: true;
        createdAt: true;
        updatedAt: true;
    };
}>;

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

export interface UserAuthSubject {
    id: string;
    role: Role;
    email: string;
    passwordHash: string; // возможно стоит сделать string | null
    refreshToken: string | null; // возможно стоит сделать string | null
}

export interface CreateUserCredentialsDto {
    email: string;
    passwordHash: string;
}


export interface UpdateUserCredentialsDto {
    email?: string;
    passwordHash?: string;
    refreshToken?: string | null;
}


