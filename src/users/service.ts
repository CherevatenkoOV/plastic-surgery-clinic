import fs from "node:fs/promises";
import {paths} from "../shared/paths.js";
import {
    CreateUserBody, Credentials,
    UpdateUserBody,
    User as UserType,
    UserByIdData,
    UserPublic,
    UsersData,
    UsersParams
} from "./types.js";
import {Request, Response} from "express";
import {User as UserEntity} from "./user-model.js";
import {id} from "../shared/validation/joi-common.js";
import bcrypt from "bcrypt";


export class Service {
    static async getUsers(): Promise<UserPublic[]> {
        const users = await ServiceHelper.getUsersData();
        return users.publicUsers
    }

    static async getUserById(req: Request<UsersParams>): Promise<UserPublic | undefined> {
        const user = await ServiceHelper.getUserDataBy({id: req.params.id});
        return user.publicUser
    }

    static async createUser(req: Request<{}, unknown, CreateUserBody>): Promise<UserPublic> {
        const users = await ServiceHelper.getUsersData();
        const {firstName, lastName, email, password} = req.body;

        const alreadyExist = users.fullUsers.find((user: UserType) => user.email === email);

        if (alreadyExist) throw new Error('User with specified email already exists.')

        const registeredUser: UserEntity = await UserEntity.register({firstName, lastName, email, password})

        users.fullUsers.push(registeredUser.toStorageObject());

        await fs.writeFile(
            paths.USERS,
            JSON.stringify(users.fullUsers),
            {encoding: 'utf-8'},
        )

        return registeredUser.toJSON();
    }

    static async loginUser(req: Request<{}, unknown, Credentials>) {
        const {email, password} = req.body;
        // ??????????????????????????????????
        // const users: UsersData = await ServiceHelper.getUsersData()
        const {fullUsers, publicUsers} = await ServiceHelper.getUsersData()
        const user = await ServiceHelper.getUserDataBy({email}, users)

        if(!await bcrypt.compare(password, user.fullUser!.password)) throw new Error("Wrong password")
        // ??????????????????????????????????????
        const tokens = UserEntity.login({email, password}, users.fullUsers)

    }

    static async updateUser(req: Request<UsersParams, unknown, UpdateUserBody>): Promise<UserPublic> {
        const id = req.params.id;
        const users = await ServiceHelper.getUsersData();
        const targetUser = users.fullUsers.find((user: UserType) => user.id === id)

        if (!targetUser) {
            throw new Error("Specified user is not found")
        } else {
            const updatedUser: UserType = {
                id: targetUser.id,
                firstName: req.body.firstName ?? targetUser.firstName,
                lastName: req.body.lastName ?? targetUser.lastName,
                email: req.body.email ?? targetUser.email,
                password: req.body.password ?? targetUser.password,
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


            const {id, firstName, lastName, email, createdAt, updatedAt} = updatedUser;

            return {id, firstName, lastName, email, createdAt, updatedAt} as UserPublic
        }
    }

    static async deleteUser(req: Request<UsersParams>): Promise<void> {
        const users = await ServiceHelper.getUsersData();
        const updatedUsers = users.fullUsers.filter(user => user.id !== req.params.id)

        await fs.writeFile(
            paths.USERS,
            JSON.stringify(updatedUsers),
            {encoding: 'utf-8'},
        )
    }
}

export class ServiceHelper {
    static async getUsersData(): Promise<UsersData> {
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

    static async getUserDataBy(
        filter: { id?: string, email?: string },
        usersData?: UsersData
    ): Promise<UserByIdData> {
        const users: UsersData = usersData ?? await this.getUsersData();

// переписать на if
        const fullUser: UserType | undefined = users.fullUsers.find((user: UserType) =>
            filter.id ? user.id === filter.id :
                filter.email ? user.email === filter.email :
                    undefined
        )

        const publicUser: UserPublic | undefined = users.publicUsers.find((user: UserPublic) =>
            filter.id ? user.id === filter.id :
                filter.email ? user.email === filter.email : undefined
        )

        if (!fullUser && !publicUser) throw new Error("The specified user was not found")

        return {
            fullUser: fullUser, publicUser
        }
    }
}