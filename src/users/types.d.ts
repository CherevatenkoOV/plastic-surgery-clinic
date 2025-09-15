
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

export type UserItem = Pick<User, 'id', 'firstName', 'lastName', 'createdAt', 'updatedAt'>

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

export type CreateUserData = Pick<User, 'firstName' | 'lastName'>;

export type UpdateUserBody = Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'password'>>;


