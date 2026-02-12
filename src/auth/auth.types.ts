import {UserRole} from "../generated/prisma/enums";

export type AuthUser = {
    id: string;
    role: UserRole
}

export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
}