import {Role} from "../users/users.types";

export type AuthUser = {
    id: string;
    role: Role
}

export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
}