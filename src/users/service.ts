import fs from "node:fs/promises";
import {paths} from "../shared/paths.js";
import {CreateUserDto, UpdateUserDto, User, UserDto, UserFilter, CredentialsDto} from "./types.js";
import {randomUUID} from "node:crypto";
import {UserRepository} from "./repository/user-repository.js";

export class UserService {
    constructor(private readonly userRepo: UserRepository) {}

    async get(filter?: UserFilter): Promise<User[]> {
        return await this.userRepo.find(filter)
    }

    async getById(id: string): Promise<User | undefined> {
        return await this.userRepo.findById(id)
    }

    async getByEmail(email: string): Promise<User | undefined> {
        return await this.userRepo.findByEmail(email)
    }

    async create(userData: CreateUserDto): Promise<User> {
        return await this.userRepo.create(userData)
    }
    async update(id: string, userData: UpdateUserDto): Promise<User | undefined> {
       return await this.userRepo.updateProfile(id, userData)
    }


    async remove(id: string): Promise<void> {
        await this.userRepo.delete(id)
    }

    async emailExists(email: string): Promise<boolean> {
        return !!(await this.getByEmail(email));
    }
}

export class ServiceHelper {

}




