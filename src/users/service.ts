import fs from "node:fs/promises";
import {paths} from "../shared/paths.js";
import {
    AuthTokens,
    CreateUserBody,
    UpdateUserBody,
    User as UserType, UserCredentials,
    UserData,
    UserPublic,
    UsersData,
    UsersParams
} from "./types.js";
import {Request} from "express";
import bcrypt from "bcrypt";
import {randomUUID} from "node:crypto";
import jwt, {JwtPayload} from "jsonwebtoken";
import {id} from "../shared/validation/joi-common.js";
import {string} from "joi";
import {login} from "./users-controller.js";


export class Service {
    static async getAll(): Promise<UserPublic[]> {
        const users = await ServiceHelper.getAllData();
        return users.publicUsers
    }

    static async getById(req: Request<UsersParams>): Promise<UserPublic | undefined> {
        const user = await ServiceHelper.getDataBy({id: req.params.id});
        return user.publicUser
    }

    static async register(req: Request<{}, unknown, CreateUserBody>): Promise<{
        userData: UserPublic,
        tokens: AuthTokens
    }> {
        const users = await ServiceHelper.getAllData();
        const {firstName, lastName, email, password} = req.body;

        const alreadyExist = users.fullUsers.find((user: UserType) => user.email === email);

        if (alreadyExist) throw new Error('User with specified email already exists.')

        const saltNumber = 10;
        const hashedPassword: string = await bcrypt.hash(password, saltNumber)

        const id = randomUUID();
        const tokens = ServiceHelper.generateTokens({id})

        const now = new Date().toISOString();
        const registeredUser: UserType = {
            id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            refreshToken: tokens.refreshToken,
            createdAt: now,
            updatedAt: now,
        }
        users.fullUsers.push(registeredUser);

        await fs.writeFile(
            paths.USERS,
            JSON.stringify(users.fullUsers),
            {encoding: 'utf-8'},
        )

        return {
            userData: {
                id: registeredUser.id,
                firstName: registeredUser.firstName,
                lastName: registeredUser.lastName,
                email: registeredUser.email,
                createdAt: registeredUser.createdAt,
                updatedAt: registeredUser.updatedAt,
            },
            tokens: tokens
        };
    }

    static async login(req: Request<{}, unknown, UserCredentials>): Promise<AuthTokens> {
        const {email, password} = req.body;

        const users: UsersData = await ServiceHelper.getAllData()
        const user: UserData = await ServiceHelper.getDataBy({email}, users)

        const passwordMatch: boolean = await bcrypt.compare(password, user.fullUser!.password)
        if (!passwordMatch) throw new Error("Wrong password")
        const tokens = ServiceHelper.generateTokens({id: user.fullUser!.id})
        await ServiceHelper.saveRefreshToken(user.fullUser!.id, tokens.refreshToken)

        return tokens
    }

    static async update(req: Request<UsersParams, unknown, UpdateUserBody>): Promise<UserPublic> {
        const id = req.params.id;
        const users = await ServiceHelper.getAllData();
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

    static generateTokens(payload: JwtPayload) {
        const accessTokenKey = process.env.ACCESS_TOKEN_SECRET;
        const refreshTokenKey = process.env.REFRESH_TOKEN_SECRET;

        if (!accessTokenKey || !refreshTokenKey) throw new Error("The private key was not found")

        const accessToken = jwt.sign(payload, accessTokenKey, {expiresIn: "15m"})
        const refreshToken = jwt.sign(payload, refreshTokenKey, {expiresIn: "30d"})

        return {accessToken, refreshToken}
    }

    static async saveRefreshToken(userId: string, refreshToken: string) {
        const users = await this.getAllData();
        const user = await this.getDataBy({id: userId}, users)

        user.fullUser!.refreshToken = refreshToken;

        await fs.writeFile(
            paths.USERS,
            JSON.stringify(users.fullUsers),
            {encoding: 'utf-8'},
        )

        return refreshToken;
    }
}


