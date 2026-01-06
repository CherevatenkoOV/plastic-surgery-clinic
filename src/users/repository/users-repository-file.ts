import {IUsersRepository} from "./i-users-repository.js";
import {CreateUserDto, CredentialsDto, UpdateUserDto, User, UserDto, UserFilter} from "../types.js";
import fs from "node:fs/promises";
import {paths} from "../../shared/paths.js";
import {randomUUID} from "node:crypto";


export class UsersRepositoryFile implements IUsersRepository {

    async find(filter?: UserFilter): Promise<User[]> {
        const data: string = await fs.readFile(paths.USERS, {encoding: "utf-8"})
        const users = JSON.parse(data)

        if (!filter || Object.keys(filter).length === 0) return users

        let filteredUsers = users;
        if (filter?.first_name) filteredUsers = filteredUsers.filter((u: UserDto) => u.first_name.toLowerCase() === filter.first_name?.toLowerCase())
        if (filter?.last_name) filteredUsers = filteredUsers.filter((u: UserDto) => u.last_name.toLowerCase() === filter.last_name?.toLowerCase())

        if (!filteredUsers.length) throw new Error("The specified user(s) was(were) not found")
        return users
    }

    async findById(id: string): Promise<User> {
        const users = await this.find()
        const targetUser = users.find((u) => u.id === id)
        if (!targetUser) throw new Error("User with specified id was not found")

        return targetUser
    }

    async findByEmail(email: string): Promise<User> {
        const users = await this.find()
        const targetUser = users.find((u: User) => u.auth.email === email.toLowerCase())
        if (!targetUser) throw new Error("User with specified email was not found")

        return targetUser
    }

    async create(userData: CreateUserDto): Promise<User> {
        const {first_name, last_name, role, auth} = userData;
        const users = await this.find();

        const now = new Date().toISOString();

        const createdUser: User = {
            id: randomUUID(),
            first_name: first_name,
            last_name: last_name,
            role: role,
            created_at: now,
            updated_at: now,
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

    async updateProfile(id: string, data: UpdateUserDto): Promise<User> {
        const {first_name, last_name} = data;
        const user = await this.findById(id);
        const users = await this.find();

        const updatedUser: User = {
            id: user.id,
            first_name: first_name ?? user.first_name,
            last_name: last_name ?? user.last_name,
            role: user.role,
            created_at: user.created_at,
            updated_at: new Date().toISOString(),
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
    async updateCredentials(id: string, credentials: CredentialsDto): Promise<User> {
        const {email, password, refreshToken} = credentials;
        const user = await this.findById(id);
        const users = await this.find();

        const updatedUser: User = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            created_at: user.created_at,
            updated_at: new Date().toISOString(),
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

    async delete(id: string): Promise<void> {
        const users = await this.find();
        const updatedUsers = users.filter((user: User) => user.id !== id)

        await fs.writeFile(
            paths.USERS,
            JSON.stringify(updatedUsers),
            {encoding: 'utf-8'},
        )
    }
}