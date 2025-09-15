import {CreateUserData} from "../users/types.js";

export interface AuthRegisterBody extends Pick<CreateUserData, 'firstName' | 'lastName'>{
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

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}