import fs from "node:fs/promises";
import {paths} from "../shared/paths.js";
import {UserWithoutAuth, CreateUserDto, UpdateUserDto, User, UserDto, UserFilter} from "./types.js";
import {randomUUID} from "node:crypto";
import {sanitizeUsers} from "./helpers/sanitize-users.js";
import {sanitizeUser} from "./helpers/sanitize-user.js";

export class Service {

    // NOTE: refactored
    static async get(filter?: UserFilter): Promise<UserDto[]> {
        const users = await ServiceHelper.getUsersData(filter)
        return sanitizeUsers(users)
    }

    // NOTE: created
    static async getById(id: string): Promise<UserDto | undefined> {
        const user = await ServiceHelper.getUserDataById(id)
        return sanitizeUser(user)
    }

    // NOTE: created
    static async getByEmail(email: string): Promise<UserDto | undefined> {
        const user = await ServiceHelper.getUserDataByEmail(email)
        return sanitizeUser(user)
    }

    // NOTE: refactored
    static async update(id: string, userData: UpdateUserDto): Promise<UserDto | undefined> {
        const updatedUser = await ServiceHelper.updateUserData(id, userData)
        return sanitizeUser(updatedUser)
    }

    // NOTE: refactored
    static async remove(id: string): Promise<void> {
        await ServiceHelper.deleteUserData(id)
    }
}

export class ServiceHelper {

    // DEPRECATED
    // static async getBasicInfo(filter?: UserFilter): Promise<User[]> {
    //     const data: string = await fs.readFile(paths.USERS, {encoding: "utf-8"})
    //     const users = JSON.parse(data)
    //     if (!filter) return users
    //
    //     let user: User | undefined;
    //     if ('id' in filter) user = users.find((u: User) => u.id === filter.id)
    //     if ('email' in filter) user = users.find((u: User) => u.auth.email === filter.email)
    //
    //     if (!user) throw new Error("The specified user was not found")
    //     return [user]
    // }

// DEPRECATED
//     static async getFullInfo(role: Role, filter?: UserFilter, query?: AllInfoUsersQuery): Promise<FullUser[]> {
//         let data = await this.getBasicInfo()
//         let users: User[] = Array.isArray(data) ? data : [data]
//
//         let usersDetails: RoleData[];
//
//         switch (role) {
//             case (Role.DOCTOR):
//                 usersDetails = await DoctorServiceHelper.getDoctorsData()
//                 users = users.filter(u => u.role === Role.DOCTOR)
//                 break;
//             case (Role.PATIENT):
//                 usersDetails = await PatientServiceHelper.getPatientsData()
//                 users = users.filter(u => u.role === Role.PATIENT)
//                 break;
//             default:
//                 throw new Error("Specified role does not exist")
//         }
//
//         const allInfoUsers: FullUser[] = users.map(user => {
//                 return {
//                     profile: user,
//                     roleData: usersDetails.find(userDetails => user.id === userDetails.userId)
//                 }
//             }
//         )
//
//         let result = allInfoUsers
//
//         if (filter) {
//             if ('id' in filter) result = allInfoUsers.filter((u: FullUser) => u.profile.id === filter.id)
//             if ('email' in filter) result = allInfoUsers.filter((u: FullUser) => u.profile.auth.email === filter.email)
//         }
//
//         if (query && Object.keys(query).length > 0) {
//             console.log('query block worked')
//             console.log(query)
//
//             const {firstName, lastName} = query;
//
//             if ('specialization' in query && role === Role.DOCTOR) {
//                 result = result.filter(
//                     user => {
//                         const doctorData = user.roleData as Doctor;
//                         return doctorData.specialization === query.specialization;
//                     })
//             }
//
//             if (firstName) {
//                 result = result.filter(
//                     user => user.profile.firstName === firstName
//                 )
//             }
//
//             if (lastName) {
//                 result = result.filter(
//                     user => user.profile.lastName === lastName
//                 )
//             }
//         }
//
//         return result
//     }

    // NOTE: implemented
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

    // NOTE: implemented
    static async getUserDataById(id: string): Promise<User> {
        const users = await this.getUsersData()
        const targetUser = users.find((u) => u.id === id)
        if (!targetUser) throw new Error("The specified user was not found")

        return targetUser
    }

    // NOTE: implemented
    static async getUserDataByEmail(email: string): Promise<User> {
        const users = await this.getUsersData()
        const targetUser = users.find((u: User) => u.auth.email === email.toLowerCase())
        if (!targetUser) throw new Error("The specified user was not found")

        return targetUser
    }

    // NOTE: done
    static async createUserData(userData: CreateUserDto): Promise<User> {
        const {firstName, lastName, role} = userData;
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
                email: undefined,
                password: undefined
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

    // NOTE: done
    static async updateUserData(id: string, data: UpdateUserDto): Promise<User> {
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
            auth: user.auth
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

    // NOTE: previous version
    // static async updateUserData(id: string, data: UpdateUserDto): Promise<User> {
    //     const {firstName, lastName} = data;
    //     const users = await ServiceHelper.getBasicInfo() as User[];
    //     const targetUser = users.find((user: User) => user.id === id)
    //
    //     if (!targetUser) throw new Error("Specified user is not found")
    //
    //     const updatedUser: UserWithoutAuth = {
    //         id,
    //         firstName: firstName ?? targetUser.firstName,
    //         lastName: lastName ?? targetUser.lastName,
    //         role: targetUser.role,
    //         createdAt: targetUser.createdAt,
    //         updatedAt: new Date().toISOString(),
    //         auth: targetUser.auth
    //     }
    //
    //     const index = users.findIndex((user) => user.id === targetUser.id);
    //     users[index] = updatedUser;
    //
    //     await fs.writeFile(
    //         paths.USERS,
    //         JSON.stringify(users),
    //         {encoding: 'utf-8'},
    //     )
    //
    //     const publicUser = {
    //         id,
    //         firstName: updatedUser.firstName,
    //         lastName: updatedUser.lastName,
    //         role: updatedUser.role
    //     }
    //
    //     return publicUser as UserDto
    // }

    // NOTE: done
    static async deleteUserData(id: string): Promise<void> {
        const users = await ServiceHelper.getUsersData();
        const updatedUsers = users.filter((user: User) => user.id !== id)

        await fs.writeFile(
            paths.USERS,
            JSON.stringify(updatedUsers),
            {encoding: 'utf-8'},
        )
    }

    // NOTE: previous version
    // static async deleteUserData(id: string): Promise<void> {
    //     const users = await ServiceHelper.getBasicInfo() as User[];
    //     const updatedUsers = users.filter((user: User) => user.id !== id)
    //
    //     await fs.writeFile(
    //         paths.USERS,
    //         JSON.stringify(updatedUsers),
    //         {encoding: 'utf-8'},
    //     )
    // }

    // NOTE: deprecated
    // static async saveUserData(user: User) {
    //     const users = await this.getBasicInfo()
    //     const index = users.findIndex(u => u.id === user!.id);
    //     if (index !== -1) {
    //         users[index] = user!;
    //     }
    //
    //     await fs.writeFile(
    //         paths.USERS,
    //         JSON.stringify(users),
    //         {encoding: 'utf-8'}
    //     )
    // }

}




