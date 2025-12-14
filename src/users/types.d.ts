export interface User {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
    auth: {
        email: string;
        password: string;
        refreshToken?: string;
    }
    // auth: {
    //     email: string | undefined;
    //     password: string | undefined;
    //     refreshToken?: string;
    // }
}

export type UserWithoutAuth = Omit<User, "auth">

export interface UserDto {
    id: string;
    firstName: string;
    lastName: sring;
    role: string;
}

export type UsersParams = Pick<User, 'id'>

export interface CreateUserDto {
    firstName: string;
    lastName: string;
    role: string;
    auth: {
        email: string;
        password: string;
    }
}

export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    auth?: {
        email?: string;
        password?: string;
        refreshToken?: string;
    }
}

// NOTE: prev
// export interface UpdateUserDto {
//     firstName?: string | undefined;
//     lastName?: string | undefined;
// }

export type UserFilter = Partial<Pick<User, "firstName" | "lastName">>

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


