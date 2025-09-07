
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: UserRole;
    refreshToken?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UsersData {
    fullUsers: User[];
    publicUsers: UserPublic[]
}

export interface UserData {
    fullUser: User | undefined;
    publicUser: UserPublic | undefined
}

export type UserPublic = Omit<User, 'password'>

export type UsersParams = Pick<User, 'id'>

export type CreateUserBody = Pick<User, 'firstName' | 'lastName' | 'email' | 'password'>;

export type UpdateUserBody = Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'password'>>;

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

export type UserCredentials = Pick<User, 'email' | 'password'>

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

