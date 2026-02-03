// TODO: UserEntity для работы до слоя HTTP, дальше - оставить UserDto

import { Prisma, UserRole } from "src/generated/prisma/client";


/*
 1. В типах в модулях необходимо создать ...PublicDto для ответа в контроллерах и для маппера
 */

// done
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

export interface UserPublic {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}


export interface CreateUserInput {
    firstName: string;
    lastName: string;
    role: UserRole;
    auth: {
        email: string;
        passwordHash: string;
    }
}

export interface UpdateUserInput {
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
    role: UserRole;
    email: string;
    passwordHash: string;
    refreshToken: string | null;
}

export interface UpdateUserCredentialsInput {
    email?: string;
    passwordHash?: string;
    refreshToken?: string | null;
}





