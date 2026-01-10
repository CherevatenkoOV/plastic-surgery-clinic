import {CreateUserDto, CredentialsDto, UpdateUserDto, UserEntity, UserFilter} from "../types.js";

export interface IUsersRepository {
    find(filter?: UserFilter): Promise<UserEntity[]>;
    findById(id: string): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    create(userData: CreateUserDto): Promise<UserEntity>;
    updateProfile(id: string, data: UpdateUserDto): Promise<UserEntity>;
    updateCredentials(id: string, credentials: CredentialsDto): Promise<void>;
    delete(id: string): Promise<void>;
}