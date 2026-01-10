// import {IUsersRepository} from "./i-users-repository.js";
// import {CreateUserDto, CredentialsDto, StoredUser, UpdateUserDto, UserEntity, UserFilter} from "../types.js";
// import fs from "node:fs/promises";
// import {paths} from "../../shared/paths.js";
// import {randomUUID} from "node:crypto";
//
//
// export class UsersRepositoryFile implements IUsersRepository {
//     private toEntity(user: StoredUser) {
//         return {
//             ...user,
//             createdAt: new Date(user.createdAt),
//             updatedAt: new Date(user.updatedAt)
//         }
//     }
//
//     private toStored(user: UserEntity) {
//         return {
//             ...user,
//             createdAt: user.createdAt.toISOString(),
//             updatedAt: user.updatedAt.toISOString()
//         }
//     }
//
//     // DONE
//     async find(filter?: UserFilter): Promise<UserEntity[]> {
//         const data: string = await fs.readFile(paths.USERS, {encoding: "utf-8"})
//         const storedUsers: StoredUser[] = JSON.parse(data)
//         const users: UserEntity[] = storedUsers.map(u => this.toEntity(u))
//
//         if (!filter || Object.keys(filter).length === 0) return users
//
//         const firstName = filter?.firstName?.trim().toLowerCase()
//         const lastName = filter?.lastName?.trim().toLowerCase()
//
//         if (!firstName && !lastName) return users
//
//         const filteredUsers: UserEntity[] = users.filter((u) => {
//             const uFirstName = u.firstName?.trim().toLowerCase()
//             const uLastName = u.lastName?.trim().toLowerCase()
//
//             if (firstName && uFirstName !== firstName) return false
//             if (lastName && uLastName !== lastName) return false
//
//             return true
//         })
//
//         if (filteredUsers.length === 0) throw new Error("No users matched the filter");
//
//         return filteredUsers
//     }
//
//     // DONE
//     async findById(id: string): Promise<UserEntity> {
//         const data: string = await fs.readFile(paths.USERS, {encoding: "utf-8"})
//         const storedUsers: StoredUser[] = JSON.parse(data)
//         const users: UserEntity[] = storedUsers.map(u => this.toEntity(u))
//
//         const user = users.find((u) => u.id === id)
//
//         if (!user) throw new Error(`User with id ${id} not found`)
//
//         return user
//     }
//
//     // DONE
//     async findByEmail(email: string): Promise<UserEntity> {
//         const data: string = await fs.readFile(paths.USERS, {encoding: "utf-8"})
//         const storedUsers: StoredUser[] = JSON.parse(data)
//         const users: UserEntity[] = storedUsers.map(u => this.toEntity(u))
//
//         const user = users.find((u: UserEntity) => {
//             if (!u.userAuth) return false
//
//             return u.userAuth.email.trim().toLowerCase() === email.trim().toLowerCase()
//         })
//
//         if (!user) throw new Error(`User with email ${email} was not found`)
//
//         return user
//     }
//
//     // DONE
//     async create(userData: CreateUserDto): Promise<UserEntity> {
//         const {firstName, lastName, role, auth} = userData;
//
//         const data: string = await fs.readFile(paths.USERS, {encoding: "utf-8"})
//         const storedUsers: StoredUser[] = JSON.parse(data)
//         const users: UserEntity[] = storedUsers.map(u => this.toEntity(u))
//
//         const now = new Date();
//
//         const createdUser: UserEntity = {
//             id: randomUUID(),
//             firstName,
//             lastName,
//             role,
//             createdAt: now,
//             updatedAt: now,
//             userAuth: {
//                 email: auth.email,
//                 password: auth.password,
//                 refreshToken: null
//             }
//         }
//
//         users.push(createdUser)
//         const updatedStoredUsers = users.map(u => this.toStored(u))
//         await fs.writeFile(
//             paths.USERS,
//             JSON.stringify(updatedStoredUsers),
//             {encoding: 'utf-8'},
//         )
//
//         return createdUser
//     }
//
//     async updateProfile(id: string, data: UpdateUserDto): Promise<UserEntity> {
//         const {firstName, lastName} = data;
//         const user = await this.findById(id);
//         const users = await this.find();
//
//         const updatedUser: UserEntity = {
//             id: user.id,
//             firstName: firstName ?? user.firstName,
//             lastName: lastName ?? user.lastName,
//             role: user.role,
//             createdAt: user.createdAt,
//             updatedAt: new Date().toISOString(),
//             userAuth: {
//                 email: user.userAuth.email,
//                 password: user.userAuth.password,
//                 refreshToken: user.userAuth.refreshToken,
//             }
//         }
//
//         const index = users.findIndex((user) => user.id === updatedUser.id);
//         users[index] = updatedUser;
//
//         await fs.writeFile(
//             paths.USERS,
//             JSON.stringify(users),
//             {encoding: 'utf-8'},
//         )
//
//         return updatedUser
//     }
//
//     // NOTE: this one should only save the credentials (with hashedPassword) without checking. subtle layer
//     async updateCredentials(id: string, credentials: CredentialsDto): Promise<UserEntity> {
//         const {email, password, refreshToken} = credentials;
//         const user = await this.findById(id);
//         const users = await this.find();
//
//         const updatedUser: UserEntity = {
//             id: user.id,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             role: user.role,
//             createdAt: user.createdAt,
//             updatedAt: new Date().toISOString(),
//             userAuth: {
//                 email: email ?? user.userAuth.email,
//                 password: password ?? user.userAuth.password,
//                 refreshToken: refreshToken ?? user.userAuth.refreshToken
//             }
//         }
//
//         const index = users.findIndex((user) => user.id === updatedUser.id);
//         users[index] = updatedUser;
//
//         await fs.writeFile(
//             paths.USERS,
//             JSON.stringify(users),
//             {encoding: 'utf-8'},
//         )
//
//         return updatedUser
//     }
//
//     async delete(id: string): Promise<void> {
//         const users = await this.find();
//         const updatedUsers = users.filter((user: UserEntity) => user.id !== id)
//
//         await fs.writeFile(
//             paths.USERS,
//             JSON.stringify(updatedUsers),
//             {encoding: 'utf-8'},
//         )
//     }
// }