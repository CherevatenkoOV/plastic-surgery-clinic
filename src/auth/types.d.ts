import {CreateUserDto, CreateRoleData} from "../users/types.js";

export interface AuthEntity {
    userId: string;
    email: string;
    password: string;
    refreshToken?: string  | null;
}

export interface AuthDto {
    email: string;
    password: string;
    refreshToken?: string  | null;
}


export interface AuthRegisterBody{
    email: string;
    password: string;
}

export interface RecoverPasswordDto {
    newPassword: string;
    confirmPassword: string;
}

export interface UpdatePasswordDto {
    email: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}


export interface ResetPasswordDto {
    email: string;
}


export interface RecoverPasswordParams {
    resetToken: string;
}

// export type Credentials = Pick<AuthItem, 'email' | 'password'>


export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export type FullRegisterInfo = AuthRegisterBody & CreateUserDto & (СreateDoctorDto | CreatePatientDto)

// NOTE: previous version
// export type FullRegisterInfo = AuthRegisterBody & CreateUserDto & CreateRoleData

export type AuthFilter =
    | { userId: string }
    | { email: string }