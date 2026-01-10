// TODO: UserEntity для работы до слоя HTTP, дальше - оставить UserDto
import {AuthEntity} from "../auth/types";
import {UserRole} from "../generated/prisma/enums";

// export interface UserEntity {
//     id: string;
//     firstName: string;
//     lastName: string;
//     role: UserRole;
//     createdAt: Date;
//     updatedAt: Date;
//     userAuth: Omit<AuthEntity, "userId"> | null
// }

export interface UserEntity {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}



// export type UserWithoutAuth = Omit<UserEntity, "userAuth">

export interface UserDto {
    id: string;
    firstName: string;
    lastName: sring;
    role: string;
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

export interface FullUserBase {
    profile: UserWithoutAuth | UserDto
}

export interface CreateCredentialsDto {
    email: string;
    passwordHash: string;
}

export interface CredentialsDto {
    email?: string;
    passwordHash?: string;
    refreshToken?: string;
}


