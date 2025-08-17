import fs from "node:fs/promises";
import {paths} from "../shared/paths.js";
import {
    AuthTokens,
    ChangePasswordBody,
    CreateUserBody,
    RequestResetPasswordBody,
    ResetPasswordBody,
    ResetPasswordQuery,
    UpdateUserBody,
    User as UserType,
    UserCredentials,
    UserData,
    UserPublic,
    UsersData,
    UsersParams
} from "./types.js";
import e, {Request} from "express";
import bcrypt from "bcrypt";
import {randomUUID} from "node:crypto";
import jwt, {JwtPayload} from "jsonwebtoken";
import nodemailer from 'nodemailer';


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

        const saltRounds = process.env!.BCRYPT_SALT_ROUNDS;
        if (!saltRounds) throw new Error("Salt rounds was not found")
        const hashedPassword: string = await bcrypt.hash(password, saltRounds)

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

    static async changePassword(req: Request<{}, unknown, ChangePasswordBody>): Promise<void> {
        const {email, oldPassword, newPassword, confirmPassword} = req.body;

        const users: UsersData = await ServiceHelper.getAllData()
        const user: UserData = await ServiceHelper.getDataBy({email}, users)

        const currentPasswordIsCorrect = bcrypt.compare(oldPassword, user.fullUser!.password)
        if (!currentPasswordIsCorrect) throw new Error("You entered an incorrect current password")

        if (oldPassword === newPassword) throw new Error("You have entered your current password in the \"new password\" field. ")

        if (newPassword !== confirmPassword) throw new Error("Password confirmation failed. Please make sure both passwords match.")

        const salt = Number(process.env!.BCRYPT_SALT_ROUNDS);
        if (!salt) throw new Error("Salt was not found")
        user.fullUser!.password = await bcrypt.hash(newPassword, salt)

        await fs.writeFile(
            paths.USERS,
            JSON.stringify(users.fullUsers),
            {encoding: 'utf-8'})

    }

    static async requestResetPassword(req: Request<{}, unknown, RequestResetPasswordBody>): Promise<void> {
        const {email} = req.body;
        const user = await ServiceHelper.getDataBy({email: email})

        const secret = process.env.RESET_PASSWORD_JWT + user.fullUser!.password
        const token = jwt.sign({id: user.fullUser!.id}, secret, { expiresIn: '15m' })

        const resetURL = `${process.env.API_URL}:${process.env.PORT}/users/reset-password?id=${user.fullUser!.id}&token=${token}`

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: `${process.env.MAIL_USER}`,
                pass: `${process.env.MAIL_PASS}`
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            to: user.fullUser!.email,
            from: process.env.MAIL_USER,
            subject: 'Password Reset Request',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          ${resetURL}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        }

        const info = await transporter.sendMail(mailOptions)

        // for tests
        console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    }

    static async resetPassword(req: Request<{}, unknown, ResetPasswordBody, ResetPasswordQuery>): Promise<void> {
        try {
            const {id, token} = req.query;
            const {newPassword, confirmPassword} = req.body;

            if (newPassword !== confirmPassword) throw new Error("Password confirmation failed. Please make sure both passwords match.")
            const users = await ServiceHelper.getAllData()
            console.log(id)
            const user = await ServiceHelper.getDataBy({id}, users)


            const secret = process.env.RESET_PASSWORD_JWT + user.fullUser!.password
            console.log(token)
            console.log(secret)

            try {
                jwt.verify(token, secret)
            } catch (e) {
                throw new Error("Wrong token.")
            }

            const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS)
            if (!saltRounds) throw new Error("Salt rounds not found")
            user.fullUser!.password = await bcrypt.hash(newPassword, saltRounds);

            await fs.writeFile(
                paths.USERS,
                JSON.stringify(users.fullUsers),
                {encoding: 'utf-8'}
            )
        } catch(e: any) {
            console.log(e.message)
        }

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


