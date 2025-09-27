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
    UsersParams
} from "./types.js";
import {randomUUID} from "node:crypto";
import {Role} from "../shared/roles.js";
import {ServiceHelper as DoctorServiceHelper} from "../doctors/service.js"
import {ServiceHelper as PatientServiceHelper} from "../patients/service.js"
import {Doctor} from "../doctors/types.js";

export class Service {
    // NOTE: ONLY ADMIN
    static async getAll(): Promise<User[]> {
        return await ServiceHelper.getAllData();
    }

    // NOTE: ONLY ADMIN
    static async getById(req: Request<UsersParams>): Promise<User | undefined> {
        const id = req.params.id
        return await ServiceHelper.getDataById(id);
    }

    // NOTE: ONLY ADMIN
    static async createUser(req: Request<{}, unknown, CreateUserData>): Promise<User> {
        const {firstName, lastName, role} = req.body;

        return await ServiceHelper.createUserData({firstName, lastName, role})
    }

    // NOTE: ONLY ADMIN
    static async update(req: Request<UsersParams, unknown, UpdateUserBody>): Promise<User> {
        const id = req.params.id;
        const {firstName, lastName, role} = req.body

        const updatedUser = await ServiceHelper.updateUserData(id, {firstName, lastName})

        updatedUser.role = role;
        // await ServiceHelper.saveNewUser(updatedUser)

        return updatedUser
    }


    static async remove(req: Request<UsersParams>): Promise<void> {
        const id = req.params.id
        await ServiceHelper.deleteUserData(id)
    }
}

export class ServiceHelper {
    // NOTE: remain
    static async getAllData(): Promise<User[]> {
        const data: string = await fs.readFile(paths.USERS, {encoding: "utf-8"})
        return JSON.parse(data)
    }

    // NOTE: remain
    static async getDataById(id: string, usersData?: User[]): Promise<User> {
        const users: User[] = usersData ?? await this.getAllData();
        const user = users.find((user: User) => user.id === id)

        if (!user) throw new Error("The specified user was not found")

        return user
    }

    // NOTE: remain
    static async getAllInfoUsers(role: Role, query?: unknown) {
        let users: User[] = await this.getAllData()
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

        users.sort((a, b) => a.id.localeCompare(b.id))
        usersDetails.sort((a, b) => a.userId.localeCompare(b.userId))

        let allInfoUsers: AllInfoUser[] = [];

        for (let i = 0; i < users.length; i++) {
            allInfoUsers.push({profile: users[i]!, roleData: null})

            for (const userDetail of usersDetails) {

                if (userDetail.userId && users[i]!.id !== userDetail.userId) {
                    continue
                }

                allInfoUsers[i]!.roleData = userDetail;
                break
            }
        }

        if (!query) return allInfoUsers

        const {specialization, firstName, lastName} = query as AllInfoUsersQuery;
        let filtered = allInfoUsers;

        if (specialization && role === Role.DOCTOR) {
            filtered = filtered.filter(
                user => {
                    const doctorData = user.roleData as Doctor;
                    return doctorData.specialization === specialization;
                })
        }

        if (firstName) {
            filtered = filtered.filter(
                user => user.profile.firstName === firstName
            )
        }

        if (lastName) {
            filtered = filtered.filter(
                user => user.profile.lastName === lastName
            )
        }

        return filtered
    }

    //  NOTE: remain
    static async getAllInfoUserById(id: string, users?: AllInfoUser[]) {
        const user = await ServiceHelper.getDataById(id)
        const userRole = user.role
        const allUsersData: AllInfoUser[] = users ?? await this.getAllInfoUsers(userRole)

        return allUsersData.find(u => u.profile.id === id)
    }

    // NOTE: remain
    static async createUserData(userData: CreateUserData): Promise<User> {
        const {firstName, lastName, role} = userData;
        const users = await ServiceHelper.getAllData();

        const now = new Date().toISOString();

        const createdUser: User = {
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

    // NOTE: remain
    static async updateUserData(id: string, data: UpdateUserData): Promise<User> {
        const {firstName, lastName} = data;
        const users = await ServiceHelper.getAllData();
        const targetUser = users.find((user: User) => user.id === id)

        if (!targetUser) throw new Error("Specified user is not found")

        const updatedUser: User = {
            id,
            firstName: firstName ?? targetUser.firstName,
            lastName: lastName ?? targetUser.lastName,
            role: targetUser.role,
            createdAt: targetUser.createdAt,
            updatedAt: new Date().toISOString()
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

    // NOTE: remain
    static async deleteUserData(id: string): Promise<void> {
        const users = await ServiceHelper.getAllData();
        const updatedUsers = users.filter((user: User) => user.id !== id)

        await fs.writeFile(
            paths.USERS,
            JSON.stringify(updatedUsers),
            {encoding: 'utf-8'},
        )
    }

}




