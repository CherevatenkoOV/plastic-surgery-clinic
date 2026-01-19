
export interface RegisterPatientDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
}

export interface RegisterDoctorDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    specialization: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RecoverPasswordDto {
    newPassword: string;
    confirmPassword: string;
}

export interface UpdatePasswordDto {
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

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

