import {CreateUserDto, CreateRoleData} from "../users/types.js";

// OK
export interface RegisterPatientDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
}

// OK
export interface RegisterDoctorDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    specialization: string;
}

// OK
export interface LoginDto {
    email: string;
    password: string;
}

// OK
export interface RecoverPasswordDto {
    newPassword: string;
    confirmPassword: string;
}

export interface UpdatePasswordDto {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// NOTE: is deprecated?
// export interface ResetPasswordDto {
//     email: string;
// }

export interface RecoverPasswordParams {
    resetToken: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}




// export type FullRegisterInfo = AuthRegisterBody & CreateUserDto & (СreateDoctorDto | CreatePatientDto)


// export type AuthFilter =
//     | { userId: string }
//     | { email: string }

// export interface AuthEntity {
//     userId: string;
//     email: string;
//     password: string;
//     refreshToken?: string  | null;
// }

// export interface AuthDto {
//     email: string;
//     password: string;
//     refreshToken?: string  | null;
// }


// export interface AuthRegisterBody{
//     email: string;
//     password: string;
// }
