
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

export interface UsersData {
    fullUsers: User[];
    publicUsers: UserPublic[]
}

export interface UserByIdData {
    fullUser: User | undefined;
    publicUser: UserPublic | undefined
}

export type UserPublic = Omit<User, 'password'>

export type UsersParams = Pick<User, 'id'>

export type CreateUserBody = Pick<User, 'firstName' | 'lastName' | 'email' | 'password'>;

export type UpdateUserBody = Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'password'>>;

export interface UserCreationProps {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type Credentials = Pick<User, 'email' | 'password'>

export interface Token {
    accessToken: string;
    refreshToken: string;
}

