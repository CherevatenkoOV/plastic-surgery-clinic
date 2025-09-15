import {Request} from "express";
import {
    User as UserType,
    UserData,
    UserPublic,
    UsersData
} from "../users/types.js";
import bcrypt from "bcrypt";
import fs from "node:fs/promises";
import {paths} from "../shared/paths.js";
import jwt, {JwtPayload} from "jsonwebtoken";
import nodemailer from "nodemailer";
import {ServiceHelper as UserServiceHelper} from "../users/service.js";
import {id} from "../shared/validation/joi-common.js";
import {
    AuthTokens,
    ChangePasswordBody,
    RequestResetPasswordBody,
    ResetPasswordBody,
    ResetPasswordQuery,
    Credentials, AuthRegisterBody
} from "./types.js";

export class Service {
    static async register(req: Request<{}, unknown, AuthRegisterBody>): Promise<{
        userData: UserPublic,
        tokens: AuthTokens
    }> {
        const {firstName, lastName, email, password} = req.body;
        const userData = await UserServiceHelper.createUserData({firstName, lastName})

        const users = await UserServiceHelper.getAllData();

        const alreadyExist = users.fullUsers.find((user: UserType) => user.email === email);
        if (alreadyExist) throw new Error('User with specified email already exists.')

        // const saltRounds = process.env!.BCRYPT_SALT_ROUNDS;
        const saltRounds = 10;
        if (!saltRounds) throw new Error("Salt rounds was not found")
        console.log(saltRounds)

        const hashedPassword: string = await bcrypt.hash(password, saltRounds)

        const tokens = ServiceHelper.generateTokens({id})

        const registeredUser: UserType = {
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: email,
            password: hashedPassword,
            refreshToken: tokens.refreshToken,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
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

    static async login(req: Request<{}, unknown, Credentials>): Promise<AuthTokens> {
        const {email, password} = req.body;

        const users: UsersData = await UserServiceHelper.getAllData()
        const user: UserData = await UserServiceHelper.getDataBy({email: email}, users)

        const passwordMatch: boolean = await bcrypt.compare(password, user.fullUser!.password)
        if (!passwordMatch) throw new Error("Wrong password")

        const tokens = ServiceHelper.generateTokens({id: user.fullUser!.id, role: user.fullUser!.role})
        await ServiceHelper.saveRefreshToken(user.fullUser!.id, tokens.refreshToken)

        return tokens
    }

    static async logout(req: Request): Promise<void> {
        const id = req.user!.id;

        const users: UsersData = await UserServiceHelper.getAllData()
        const user: UserData = await UserServiceHelper.getDataBy({id}, users)
        delete user.fullUser!.refreshToken;

        await fs.writeFile(
            paths.USERS,
            JSON.stringify(users.fullUsers),
            {encoding: 'utf-8'}
        )
    }

    static async changePassword(req: Request<{}, unknown, ChangePasswordBody>): Promise<void> {
        const {email, oldPassword, newPassword, confirmPassword} = req.body;

        const users: UsersData = await UserServiceHelper.getAllData()
        const user: UserData = await UserServiceHelper.getDataBy({email}, users)

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
            {encoding: 'utf-8'}
        )

    }

    static async requestResetPassword(req: Request<{}, unknown, RequestResetPasswordBody>): Promise<string> {
        const {email} = req.body;
        const user = await UserServiceHelper.getDataBy({email: email})

        const secret: string = process.env.RESET_PASSWORD_JWT as string
        const token = jwt.sign({email}, secret, {expiresIn: '15m'})
        const resetURL = `${process.env.API_URL}:${process.env.PORT}/auth/reset-password?token=${token}`

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

        // for tests:
        // make definition of info asynchronous (add await)
        const info = await transporter.sendMail(mailOptions)


        // for tests:
        // uncomment the line below
        console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

        return token;
    }

    static async resetPassword(req: Request<{}, unknown, ResetPasswordBody, ResetPasswordQuery>): Promise<void> {
        try {
            const {token} = req.query;
            const users = await UserServiceHelper.getAllData()

            const secret: string = process.env.RESET_PASSWORD_JWT as string;
            let email;
            try {
               const decoded = jwt.verify(token, secret) as {email: string};
               email = decoded.email;
            } catch (e) {
                throw new Error("Wrong token.")
            }

            const user = await UserServiceHelper.getDataBy({email: email}, users)

            const {newPassword, confirmPassword} = req.body;
            if (newPassword !== confirmPassword) throw new Error("Password confirmation failed. Please make sure both passwords match.")

            const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS)
            if (!saltRounds) throw new Error("Salt rounds not found")
            user.fullUser!.password = await bcrypt.hash(newPassword, saltRounds);

            await fs.writeFile(
                paths.USERS,
                JSON.stringify(users.fullUsers),
                {encoding: 'utf-8'}
            )
        } catch (e: any) {
            console.log(e.message)
        }

    }
}

export class ServiceHelper {
    static generateTokens(payload: JwtPayload) {
        const accessTokenKey = process.env.ACCESS_TOKEN_SECRET;
        const refreshTokenKey = process.env.REFRESH_TOKEN_SECRET;

        if (!accessTokenKey || !refreshTokenKey) throw new Error("The private key was not found")

        const accessToken = jwt.sign(payload, accessTokenKey, {expiresIn: "15m"})
        const refreshToken = jwt.sign(payload, refreshTokenKey, {expiresIn: "30d"})

        return {accessToken, refreshToken}
    }

    static async saveRefreshToken(userId: string, refreshToken: string) {
        const users = await UserServiceHelper.getAllData();
        const user = await UserServiceHelper.getDataBy({id: userId}, users)

        user.fullUser!.refreshToken = refreshToken;

        await fs.writeFile(
            paths.USERS,
            JSON.stringify(users.fullUsers),
            {encoding: 'utf-8'},
        )
    }
}