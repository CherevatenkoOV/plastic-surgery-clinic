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

export interface RecoverPasswordBody {
    newPassword: string;
    confirmPassword: string;
}

export interface ChangePasswordBody {
    email: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}


export interface ResetPasswordBody {
    email: string;
}


export interface RecoverPasswordParams {
    resetToken: string;
}

export type Credentials = Pick<AuthItem, 'email' | 'password'>

export type CreateCredentials = Credentials & {userId: string};

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export type FullRegisterInfo = AuthRegisterBody & CreateUserData & CreateRoleData