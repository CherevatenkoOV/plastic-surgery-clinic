import fs from "node:fs/promises";
import {paths} from "../shared/paths.js";
import {Request} from "express";
import {
    AllInfoUser,
    AllInfoUsersQuery,
    CreateUserData,
    PublicUser,
    RoleData,
    UpdateUserBody,
    UpdateUserData,
    User,
    UserFilter,
    UsersParams,
    UserWithoutAuth
} from "./types.js";
import {randomUUID} from "node:crypto";
import {Role} from "../shared/roles.js";
import {ServiceHelper as DoctorServiceHelper} from "../doctors/service.js"
import {ServiceHelper as PatientServiceHelper} from "../patients/service.js"
import {Doctor} from "../doctors/types.js";

export class Service {

    static async get(req?: Request): Promise<User[]> {
        const id = req?.params?.id;
        return await ServiceHelper.getBasicInfo(id ? {id} : undefined)
    }

    static async update(req: Request<UsersParams, unknown, UpdateUserBody>): Promise<User> {
        const id = req.params.id;
        const {firstName, lastName, role} = req.body

        return await ServiceHelper.updateUserData(id, {firstName, lastName, role})
    }

    static async remove(req: Request<UsersParams>): Promise<void> {
        const id = req.params.id
        const role = req.user!.role

        if (role === Role.DOCTOR) await DoctorServiceHelper.deleteDoctorData(id)
        if (role === Role.PATIENT) await PatientServiceHelper.deletePatientData(id)

        await ServiceHelper.deleteUserData(id)
    }
}

export class ServiceHelper {

    static async getBasicInfo(filter?: UserFilter): Promise<User[]> {
        const data: string = await fs.readFile(paths.USERS, {encoding: "utf-8"})
        const users = JSON.parse(data)
        if (!filter) return users

        let user: User | undefined;
        if ('id' in filter) user = users.find((u: User) => u.id === filter.id)
        if ('email' in filter) user = users.find((u: User) => u.auth.email === filter.email)

        if (!user) throw new Error("The specified user was not found")
        return [user]
    }


    static async getFullInfo(role: Role, filter?: UserFilter, query?: AllInfoUsersQuery): Promise<AllInfoUser[]> {
        let data = await this.getBasicInfo()
        let users: User[] = Array.isArray(data) ? data : [data]

        let usersDetails: RoleData[];

        switch (role) {
            case (Role.DOCTOR):
                usersDetails = await DoctorServiceHelper.getDoctorsData()
                users = users.filter(u => u.role === Role.DOCTOR)
                break;
            case (Role.PATIENT):
                usersDetails = await PatientServiceHelper.getPatientsData()
                users = users.filter(u => u.role === Role.PATIENT)
                break;
            default:
                throw new Error("Specified role does not exist")
        }

        const allInfoUsers: AllInfoUser[] = users.map(user => {
                return {
                    profile: user,
                    roleData: usersDetails.find(userDetails => user.id === userDetails.userId)
                }
            }
        )

        let result = allInfoUsers

        if (filter) {
            if ('id' in filter) result = allInfoUsers.filter((u: AllInfoUser) => u.profile.id === filter.id)
            if ('email' in filter) result = allInfoUsers.filter((u: AllInfoUser) => u.profile.auth.email === filter.email)
        }

        if (query && Object.keys(query).length > 0) {
            console.log('query block worked')
            console.log(query)

            const {firstName, lastName} = query;

            if ('specialization' in query && role === Role.DOCTOR) {
                result = result.filter(
                    user => {
                        const doctorData = user.roleData as Doctor;
                        return doctorData.specialization === query.specialization;
                    })
            }

            if (firstName) {
                result = result.filter(
                    user => user.profile.firstName === firstName
                )
            }

            if (lastName) {
                result = result.filter(
                    user => user.profile.lastName === lastName
                )
            }
        }

        return result
    }

    static async createUserData(userData: CreateUserData): Promise<User> {
        const {firstName, lastName, role} = userData;
        const users = await ServiceHelper.getBasicInfo() as User[];

        const now = new Date().toISOString();


        const createdUser: UserWithoutAuth = {
            id: randomUUID(),
            firstName: firstName,
            lastName: lastName,
            role: role,
            createdAt: now,
            updatedAt: now,
        }

        users.push(createdUser)
        await fs.writeFile(
            paths.USERS,
            JSON.stringify(users),
            {encoding: 'utf-8'},
        )

        return createdUser
    }

    static async updateUserData(id: string, data: UpdateUserData): Promise<User> {
        const {firstName, lastName} = data;
        const users = await ServiceHelper.getBasicInfo() as User[];
        const targetUser = users.find((user: User) => user.id === id)

        if (!targetUser) throw new Error("Specified user is not found")

        const updatedUser: UserWithoutAuth = {
            id,
            firstName: firstName ?? targetUser.firstName,
            lastName: lastName ?? targetUser.lastName,
            role: targetUser.role,
            createdAt: targetUser.createdAt,
            updatedAt: new Date().toISOString(),
            auth: targetUser.auth
        }

        const index = users.findIndex((user) => user.id === targetUser.id);
        users[index] = updatedUser;

        await fs.writeFile(
            paths.USERS,
            JSON.stringify(users),
            {encoding: 'utf-8'},
        )

        const publicUser = {
            id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            role: updatedUser.role
        }

        return publicUser as PublicUser
    }

    static async deleteUserData(id: string): Promise<void> {
        const users = await ServiceHelper.getBasicInfo() as User[];
        const updatedUsers = users.filter((user: User) => user.id !== id)

        await fs.writeFile(
            paths.USERS,
            JSON.stringify(updatedUsers),
            {encoding: 'utf-8'},
        )
    }

    static async saveUserData(user: User) {
        const users = await this.getBasicInfo()
        const index = users.findIndex(u => u.id === user!.id);
        if (index !== -1) {
            users[index] = user!;
        }

        await fs.writeFile(
            paths.USERS,
            JSON.stringify(users),
            {encoding: 'utf-8'}
        )
    }

}




