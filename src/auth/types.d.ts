import {CreateUserData, CreateRoleData} from "../users/types.js";

export interface AuthItem {
    userId: string;
    email: string;
    password: string;
    refreshToken?: string;
}

export interface AuthRegisterBody{
    email: string;
    password: string;
}

export interface ChangePasswordBody {
    email: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface RequestResetPasswordBody {
    email: string;
}

export interface ResetPasswordBody {
    newPassword: string;
    confirmPassword: string;
}

export interface ResetPasswordQuery {
    id: string;
    token: string;
}

export type Credentials = Pick<AuthItem, 'email' | 'password'>

export type CreateCredentials = Credentials & {userId: string};

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export type FullRegisterInfo = AuthRegisterBody & CreateUserData & CreateRoleData