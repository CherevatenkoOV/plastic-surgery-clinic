import fs from "node:fs/promises";
import {paths} from "../shared/paths.js";
import {CreateUserDto, UpdateUserDto, User, UserDto, UserFilter, CredentialsDto} from "./types.js";
import {randomUUID} from "node:crypto";
import {IUsersRepository} from "./repository/i-users-repository.js";

export class UsersService {
    constructor(private readonly usersRepo: IUsersRepository) {}

    async get(filter?: UserFilter): Promise<User[]> {
        return await this.usersRepo.find(filter)
    }

    async getById(id: string): Promise<User | undefined> {
        return await this.usersRepo.findById(id)
    }

    async getByEmail(email: string): Promise<User | undefined> {
        return await this.usersRepo.findByEmail(email)
    }

    async create(userData: CreateUserDto): Promise<User> {
        return await this.usersRepo.create(userData)
    }

    async update(id: string, userData: UpdateUserDto): Promise<User | undefined> {
       return await this.usersRepo.updateProfile(id, userData)
    }

    async remove(id: string): Promise<void> {
        await this.usersRepo.delete(id)
    }

    async emailExists(email: string): Promise<boolean> {
        return !!(await this.getByEmail(email));
    }
}





