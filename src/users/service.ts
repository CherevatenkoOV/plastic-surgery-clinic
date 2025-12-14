import fs from "node:fs/promises";
import {paths} from "../shared/paths.js";
import {CreateUserDto, UpdateUserDto, User, UserDto, UserFilter, CredentialsDto} from "./types.js";
import {randomUUID} from "node:crypto";

export class Service {

    static async get(filter?: UserFilter): Promise<User[]> {
        return await ServiceHelper.getUsersData(filter)
    }

    // NOTE: done
    static async getById(id: string): Promise<User | undefined> {
        return await ServiceHelper.getUserDataById(id)
    }

    // NOTE: done
    static async getByEmail(email: string): Promise<User | undefined> {
        return await ServiceHelper.getUserDataByEmail(email)
    }

    // NOTE: new service
    static async create(userData: CreateUserDto): Promise<User> {
        return await ServiceHelper.createUserData(userData)
    }
    // NOTE: done
    static async update(id: string, userData: UpdateUserDto): Promise<User | undefined> {
       return await ServiceHelper.updateUserProfileData(id, userData)
    }


    // NOTE:
    static async remove(id: string): Promise<void> {
        await ServiceHelper.deleteUserData(id)
    }

    static async emailExists(email: string): Promise<boolean> {
        return !!(await this.getByEmail(email));
    }
}

export class ServiceHelper {
        static async getUsersData(filter?: UserFilter): Promise<User[]> {
        const data: string = await fs.readFile(paths.USERS, {encoding: "utf-8"})
        const users = JSON.parse(data)

        if (!filter || Object.keys(filter).length === 0) return users

        let filteredUsers = users;
        if (filter?.firstName) filteredUsers = filteredUsers.filter((u: UserDto) => u.firstName.toLowerCase() === filter.firstName?.toLowerCase())
        if (filter?.lastName) filteredUsers = filteredUsers.filter((u: UserDto) => u.lastName.toLowerCase() === filter.lastName?.toLowerCase())

        if (!filteredUsers.length) throw new Error("The specified user(s) was(were) not found")
        return users
    }

    static async getUserDataById(id: string): Promise<User> {
        const users = await this.getUsersData()
        const targetUser = users.find((u) => u.id === id)
        if (!targetUser) throw new Error("User with specified id was not found")

        return targetUser
    }

    static async getUserDataByEmail(email: string): Promise<User> {
        const users = await this.getUsersData()
        const targetUser = users.find((u: User) => u.auth.email === email.toLowerCase())
        if (!targetUser) throw new Error("User with specified email was not found")

        return targetUser
    }

    static async createUserData(userData: CreateUserDto): Promise<User> {
        const {firstName, lastName, role, auth} = userData;
        const users = await ServiceHelper.getUsersData();

        const now = new Date().toISOString();

        const createdUser: User = {
            id: randomUUID(),
            firstName: firstName,
            lastName: lastName,
            role: role,
            createdAt: now,
            updatedAt: now,
            auth: {
                email: auth.email,
                password: auth.password
            }
        }

        users.push(createdUser)
        await fs.writeFile(
            paths.USERS,
            JSON.stringify(users),
            {encoding: 'utf-8'},
        )

        return createdUser
    }

    static async updateUserProfileData(id: string, data: UpdateUserDto): Promise<User> {
        const {firstName, lastName} = data;
        const user = await ServiceHelper.getUserDataById(id);
        const users = await ServiceHelper.getUsersData();

        const updatedUser: User = {
            id: user.id,
            firstName: firstName ?? user.firstName,
            lastName: lastName ?? user.lastName,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: new Date().toISOString(),
            auth: {
                email: user.auth.email,
                password: user.auth.password,
                refreshToken: user.auth.refreshToken,
            }
        }

        const index = users.findIndex((user) => user.id === updatedUser.id);
        users[index] = updatedUser;

        await fs.writeFile(
            paths.USERS,
            JSON.stringify(users),
            {encoding: 'utf-8'},
        )

        return updatedUser
    }

    // NOTE: this one should only save the credentials (with hashedPassword) without checking. subtle layer
    static async updateCredentialsData(id: string, credentials: CredentialsDto): Promise<User> {
        const {email, password, refreshToken} = credentials;
        const user = await ServiceHelper.getUserDataById(id);
        const users = await ServiceHelper.getUsersData();

        const updatedUser: User = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: new Date().toISOString(),
            auth: {
                email: email ?? user.auth.email,
                password: password ?? user.auth.password,
                refreshToken: refreshToken ?? user.auth.refreshToken
            }
        }

        const index = users.findIndex((user) => user.id === updatedUser.id);
        users[index] = updatedUser;

        await fs.writeFile(
            paths.USERS,
            JSON.stringify(users),
            {encoding: 'utf-8'},
        )

        return updatedUser
    }

    static async deleteUserData(id: string): Promise<void> {
        const users = await ServiceHelper.getUsersData();
        const updatedUsers = users.filter((user: User) => user.id !== id)

        await fs.writeFile(
            paths.USERS,
            JSON.stringify(updatedUsers),
            {encoding: 'utf-8'},
        )
    }
}




