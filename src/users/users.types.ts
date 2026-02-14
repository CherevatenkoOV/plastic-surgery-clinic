
import { Prisma, UserRole } from "src/generated/prisma/client";

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
}

export type UserFilter = Partial<Pick<UserEntity, "firstName" | "lastName">>

export interface UserAuthRecord {
    id: string;
    role: UserRole;
    email: string;
    passwordHash: string;
    refreshTokenHash: string | null;
}

export interface UpdateUserCredentialsInput {
    email?: string;
    passwordHash?: string;
    refreshTokenHash?: string | null;
}

export enum Role {
    PATIENT = "patient",
    DOCTOR = "doctor",
    ADMIN = "admin"
}




