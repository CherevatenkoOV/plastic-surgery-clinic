import {CreateUserDto, CredentialsDto, UpdateUserDto, User, UserFilter} from "../types.js";

export interface UserRepository {
    find(filter?: UserFilter): Promise<User[]>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    create(userData: CreateUserDto): Promise<User>;
    updateProfile(id: string, data: UpdateUserDto): Promise<User>;
    updateCredentialsData(id: string, credentials: CredentialsDto): Promise<User>;
    delete(id: string): Promise<void>;
}