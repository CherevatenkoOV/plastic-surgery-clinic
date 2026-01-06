export interface User {
    id: string;
    first_name: string;
    last_name: string;
    role: UserRole;
    created_at: string;
    updated_at: string;
    auth: {
        email: string;
        password: string;
        refreshToken?: string;
    }
}

export type UserWithoutAuth = Omit<User, "auth">

export interface UserDto {
    id: string;
    first_name: string;
    last_name: sring;
    role: string;
}

export type UsersParams = Pick<User, 'id'>

export interface CreateUserDto {
    first_name: string;
    last_name: string;
    role: string;
    auth: {
        email: string;
        password: string;
    }
}

export interface UpdateUserDto {
    first_name?: string;
    last_name?: string;
    auth?: {
        email?: string;
        password?: string;
        refreshToken?: string;
    }
}

export type UserFilter = Partial<Pick<User, "first_name" | "last_name">>

export interface FullUserBase {
    profile: UserWithoutAuth | UserDto
}

export interface CreateCredentialsDto {
    email: string;
    password: string;
}

export interface CredentialsDto {
    email?: string;
    password?: string;
    refreshToken?: string;
}


