import fs from "node:fs/promises";
import {paths} from "../shared/paths.js";
import {
    CreateUserData,
    UpdateUserBody,
    User as UserType,
    UserData, UserItem,
    UserPublic,
    UsersData,
    UsersParams
} from "./types.js";
import {Request} from "express";
import {randomUUID} from "node:crypto";
import {id} from "../shared/validation/joi-common.js";


export class Service {
    static async getAll(): Promise<UserPublic[]> {
        const users = await ServiceHelper.getAllData();
        return users.publicUsers
    }

    static async getById(req: Request<UsersParams>): Promise<UserPublic | undefined> {
        const user = await ServiceHelper.getDataBy({id: req.params.id});
        return user.publicUser
    }

    static async update(req: Request<UsersParams, unknown, UpdateUserBody>): Promise<UserPublic> {
        const id = req.params.id;
        const users = await ServiceHelper.getAllData();
        const targetUser = users.fullUsers.find((user: UserType) => user.id === id)

        if (!targetUser) throw new Error("Specified user is not found")

        const updatedUser: UserType = {
            id,
            firstName: req.body.firstName ?? targetUser.firstName,
            lastName: req.body.lastName ?? targetUser.lastName,
            email: targetUser.email,
            password: targetUser.password,
            createdAt: targetUser.createdAt,
            updatedAt: new Date().toISOString()
        }

        const index = users.fullUsers.findIndex((user: UserType) => user.id === targetUser.id);
        users.fullUsers[index] = updatedUser;

        await fs.writeFile(
            paths.USERS,
            JSON.stringify(users.fullUsers),
            {encoding: 'utf-8'},
        )

        const {firstName, lastName, createdAt, updatedAt} = updatedUser;

        return {id, firstName, lastName, createdAt, updatedAt} as UserPublic

    }

    static async remove(req: Request<UsersParams>): Promise<void> {
        const users = await ServiceHelper.getAllData();
        const updatedUsers = users.fullUsers.filter(user => user.id !== req.params.id)

        await fs.writeFile(
            paths.USERS,
            JSON.stringify(updatedUsers),
            {encoding: 'utf-8'},
        )
    }
}

export class ServiceHelper {
    static async getAllData(): Promise<UsersData> {
        try {
            const data: string = await fs.readFile(paths.USERS, {encoding: "utf-8"})
            const fullUsers: UserType[] = JSON.parse(data)
            const publicUsers: UserPublic[] = fullUsers.map((user: UserType) => {
                const {id, firstName, lastName, email, createdAt, updatedAt} = user;
                return {id, firstName, lastName, email, createdAt, updatedAt}
            })
            return {fullUsers, publicUsers}
        } catch (err) {
            throw new Error(`Something went wrong while reading users.json. Err: ${err}`)
        }
    }

    static async getDataBy(
        filter: { id?: string, email?: string },
        usersData?: UsersData
    ): Promise<UserData> {

        const users: UsersData = usersData ?? await this.getAllData();
        let fullUser: UserType | undefined, publicUser: UserPublic | undefined;

        if (filter.id) {
            fullUser = users.fullUsers.find((user: UserType) => user.id === filter.id)
            publicUser = users.publicUsers.find((user: UserPublic) => user.id === filter.id)

        } else if (filter.email) {
            fullUser = users.fullUsers.find((user: UserType) => user.email === filter.email)
            publicUser = users.publicUsers.find((user: UserPublic) => user.email === filter.email)

        } else {
            throw new Error("Filter must include either id or email");
        }

        if (!fullUser || !publicUser) throw new Error("The specified user was not found")

        return {
            fullUser: fullUser, publicUser
        }
    }

    static async createUserData(userData: CreateUserData): Promise<UserItem> {
        const {firstName, lastName} = userData;

        const now = new Date().toISOString();
        const createdUser: UserItem = {
            id: randomUUID(),
            firstName: firstName,
            lastName: lastName,
            createdAt: now,
            updatedAt: now,
        }

        return {
                id: createdUser.id,
                firstName: createdUser.firstName,
                lastName: createdUser.lastName,
                createdAt: createdUser.createdAt,
                updatedAt: createdUser.updatedAt,
        };
    }


}




