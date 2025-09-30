import {Request} from "express";
import bcrypt from "bcrypt";
import fs from "node:fs/promises";
import {paths} from "../shared/paths.js";
import jwt, {JwtPayload} from "jsonwebtoken";
import nodemailer from "nodemailer";
import {ServiceHelper as UserServiceHelper} from "../users/service.js";
import {ServiceHelper as DoctorServiceHelper} from "../doctors/service.js";
import {ServiceHelper as PatientServiceHelper} from "../patients/service.js";
import {
    AuthItem,
    AuthTokens,
    ChangePasswordBody,
    CreateCredentials,
    Credentials,
    FullRegisterInfo, RecoverPasswordBody, RecoverPasswordParams,
    ResetPasswordBody,
} from "./types.js";
import {CreateDoctorBody} from "../doctors/types.js";
import {CreatePatientBody} from "../patients/types.js";
import {Role} from "../shared/roles.js";

export class Service {
    static async register(req: Request<{}, unknown, FullRegisterInfo>): Promise<AuthTokens | null> {
        const {firstName, lastName, role, email, password} = req.body;

        if(role === Role.DOCTOR) return null

        if (await ServiceHelper.checkEmailExists(email)) throw new Error("User with specified email already exists.")

        const profile = await UserServiceHelper.createUserData({firstName, lastName, role})
        await ServiceHelper.createAuthItemData({userId: profile.id, email, password})

        switch (role) {
            case Role.DOCTOR:
                //  Some logic for creating request for new doctor.
                // Could be sending the request-email to the admin email
                break;

            case Role.PATIENT:
                const {phone} = req.body as CreatePatientBody
                await PatientServiceHelper.createPatientData({
                    userId: profile.id,
                    phone
                })
                break

            default:
                throw new Error(`Unknown role: ${role}`)
        }

        return ServiceHelper.generateTokens({id: profile.id});
    }

    static async registerByToken(req: Request<{token: string}, unknown, FullRegisterInfo>): Promise<AuthTokens> {
        const token = req.params.token;

        const secret: string = process.env.RESET_PASSWORD_JWT as string;
        let email;
        try {
            const decoded = jwt.verify(token, secret) as { email: string };
            email = decoded.email;
        } catch (e) {
            throw new Error("Wrong token.")
        }


        const {firstName, lastName, role, password} = req.body;

        if (await ServiceHelper.checkEmailExists(email)) throw new Error("User with specified email already exists.")

        const profile = await UserServiceHelper.createUserData({firstName, lastName, role})
        await ServiceHelper.createAuthItemData({userId: profile.id, email, password})

        const {specialization, schedule} = req.body as CreateDoctorBody
        await DoctorServiceHelper.createDoctorData({
            userId: profile.id,
            specialization: specialization ?? null,
            schedule: schedule ?? null
        })

        return ServiceHelper.generateTokens({id: profile.id});
    }

    static async login(req: Request<{}, unknown, Credentials>): Promise<AuthTokens> {
        const {email, password} = req.body;

        const authItem = await ServiceHelper.getDataBy({email: email})
        const userId = authItem.userId;

        const user = await UserServiceHelper.getDataById(userId)

        const passwordMatch: boolean = await bcrypt.compare(password, authItem.password)
        if (!passwordMatch) throw new Error("Wrong password")

        const tokens = ServiceHelper.generateTokens({id: userId, role: user.role})
        await ServiceHelper.saveRefreshToken(userId, tokens.refreshToken)

        return tokens
    }

    static async logout(req: Request): Promise<void> {
        const userId = req.user!.id;

        const authItems: AuthItem[] = await ServiceHelper.getAllData()
        const authItem: AuthItem = await ServiceHelper.getDataBy({id: userId}, authItems)
        delete authItem.refreshToken;

        await fs.writeFile(
            paths.AUTH,
            JSON.stringify(authItems),
            {encoding: 'utf-8'}
        )
    }

    static async recoverPassword(req: Request<RecoverPasswordParams, unknown, RecoverPasswordBody>): Promise<void> {
        const {resetToken} = req.params;
        const authItems: AuthItem[] = await ServiceHelper.getAllData()

        const secret: string = process.env.RESET_PASSWORD_JWT as string;
        let email;
        try {
            const decoded = jwt.verify(resetToken, secret) as { email: string };
            email = decoded.email;
        } catch (e) {
            throw new Error("Wrong token.")
        }

        const authItem: AuthItem = await ServiceHelper.getDataBy({email: email}, authItems)

        const {newPassword, confirmPassword} = req.body;
        if (newPassword !== confirmPassword) throw new Error("Password confirmation failed. Please make sure both passwords match.")

        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS)
        if (!saltRounds) throw new Error("Salt rounds not found")
        authItem.password = await bcrypt.hash(newPassword, saltRounds);

        await fs.writeFile(
            paths.AUTH,
            JSON.stringify(authItems),
            {encoding: 'utf-8'}
        )
    }

        static async updatePassword(req: Request<{}, unknown, ChangePasswordBody>): Promise<void> {
            const {email, oldPassword, newPassword, confirmPassword} = req.body;

            const authItems: AuthItem[] = await ServiceHelper.getAllData()
            const authItem: AuthItem = await ServiceHelper.getDataBy({email}, authItems)

            const currentPasswordIsCorrect = await bcrypt.compare(oldPassword, authItem.password)
            if (!currentPasswordIsCorrect) throw new Error("You entered an incorrect current password")

            if (oldPassword === newPassword) throw new Error("You have entered your current password in the \"new password\" field. ")

            if (newPassword !== confirmPassword) throw new Error("Password confirmation failed. Please make sure both passwords match.")

            const salt = Number(process.env!.BCRYPT_SALT_ROUNDS ?? 10);
            authItem.password = await bcrypt.hash(newPassword, salt)

            await fs.writeFile(
                paths.AUTH,
                JSON.stringify(authItems),
                {encoding: 'utf-8'}
            )
        }

    static async resetPassword(req: Request<{}, unknown, ResetPasswordBody>): Promise<string> {
        const {email} = req.body;

        const authItem: AuthItem = await ServiceHelper.getDataBy({email})

        const secret: string = process.env.RESET_PASSWORD_JWT as string

        const token = jwt.sign({email}, secret, {expiresIn: '15m'})
        const resetURL = `${process.env.API_URL}:${process.env.PORT}/auth/recover/${token}`

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: `${process.env.MAIL_USER}`,
                pass: `${process.env.MAIL_PASS}`
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            to: authItem.email,
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
}

export class ServiceHelper {
    static async getAllData(): Promise<AuthItem[]> {
        const data = await fs.readFile(paths.AUTH, {encoding: 'utf-8'})
        return JSON.parse(data)
    }

    static async getDataBy(filter: { id?: string, email?: string }, authItemsData?: AuthItem[]): Promise<AuthItem> {
        if (!filter.id && !filter.email) throw new Error("At least one filter field must be specified");

        const authItems: AuthItem[] = authItemsData ?? await this.getAllData();

        const authItem = authItems.find((authItem: AuthItem) => authItem.email === filter.email || authItem.userId === filter.id)

        if (!authItem) throw new Error("Specified user was not found")

        return authItem
    }

    static async createAuthItemData(credentialsData: CreateCredentials) {
        const {userId, email, password} = credentialsData;

        const salt = Number(process.env!.BCRYPT_SALT_ROUNDS ?? 10);
        const hashedPassword: string = await bcrypt.hash(password, salt)

        const authItem = {
            userId,
            email,
            password: hashedPassword
        }

        const authItems = await ServiceHelper.getAllData();
        if (authItems.find(c => c.email === email)) throw new Error("Credentials with specified email already exists")

        authItems.push(authItem)
        await fs.writeFile(
            paths.AUTH,
            JSON.stringify(authItems),
            {encoding: 'utf-8'}
        )

        return authItem
    }

    static async deleteAuthItemData(userId: string): Promise<void> {
        const authItems = await ServiceHelper.getAllData();
        const updatedAuthItems = authItems.filter((authItem: AuthItem) => authItem.userId !== userId)

        await fs.writeFile(
            paths.AUTH,
            JSON.stringify(updatedAuthItems),
            {encoding: 'utf-8'},
        )
    }

    static async checkEmailExists(email: string) {
        try {
            const authData = await fs.readFile(paths.AUTH, {encoding: "utf-8"})
            const authItems = JSON.parse(authData)
            return authItems.some((item: AuthItem) => item.email === email)
        } catch (e) {
            throw new Error(`Something went wrong with checkEmailExists function. Err: ${e}`)
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
        const authItems = await ServiceHelper.getAllData();
        const authItem = await ServiceHelper.getDataBy({id: userId}, authItems)

        authItem.refreshToken = refreshToken;
        await fs.writeFile(
            paths.AUTH,
            JSON.stringify(authItems),
            {encoding: 'utf-8'},
        )
    }
}