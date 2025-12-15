import bcrypt from "bcrypt";
import jwt, {JwtPayload} from "jsonwebtoken";
import nodemailer from "nodemailer";
import {UsersService as UserService} from "../users/service.js";
import {ServiceHelper as UserServiceHelper} from "../users/service.js";
import {ServiceHelper as DoctorServiceHelper} from "../doctors/service.js";
import {ServiceHelper as PatientServiceHelper} from "../patients/service.js";
import {
    AuthTokens,
    UpdatePasswordDto,
    FullRegisterInfo, RecoverPasswordDto,
    ResetPasswordDto,
} from "./types.js";
import {Role} from "../shared/roles.js";
import {User, CreateCredentialsDto} from "../users/types.js";
import {emailExists} from "../users/helpers/email-exists.js";

export class Service {
    static async register(registerData: FullRegisterInfo): Promise<AuthTokens | null> {
        const {firstName, lastName, role, email, password} = registerData;

        // NOTE: checkEmailExists maybe should be replaced to helpers
        if (await emailExists(email)) throw new Error("User with specified email already exists.")

        const hashedPassword = await this.hashPassword(password)

        const user = await UserService.create({firstName, lastName, role, auth: {email, password: hashedPassword}})

        switch (role) {
            case Role.DOCTOR:
                //  Some logic for creating request for new doctor.
                // Could be sending the request-email to the admin email
                break;

            case Role.PATIENT:
                const {phone} = registerData
                await PatientServiceHelper.createPatientData({
                    userId: user.id,
                    phone
                })
                break

            default:
                throw new Error(`Unknown role: ${role}`)
        }

        const tokens = this.generateTokens({id: user.id})

        await UserServiceHelper.updateCredentialsData(user.id, {refreshToken: tokens.refreshToken})

        return tokens
    }

    static async registerByToken(token: string, registerInfo: FullRegisterInfo): Promise<AuthTokens> {

        const secret: string = process.env.RESET_PASSWORD_JWT as string;

        let email;

        try {
            const decoded = jwt.verify(token, secret) as { email: string };
            email = decoded.email;
        } catch (e) {
            throw new Error("Wrong token.")
        }

        const {firstName, lastName, role, password} = registerInfo;

        if (await UserService.emailExists(email)) throw new Error("User with specified email already exists.")

        const hashedPassword = await this.hashPassword(password)

        const user = await UserService.create({firstName, lastName, role, auth: {email, password: hashedPassword}})

        const {specialization, schedule} = registerInfo

        await DoctorServiceHelper.createDoctorData({
            userId: user.id,
            specialization: specialization ?? null,
            schedule: schedule ?? null
        })

        return Service.generateTokens({id: user.id});
    }

    static async login(credentials: CreateCredentialsDto): Promise<AuthTokens> {
        const {email, password} = credentials;

        const user = await UserService.getByEmail(email)
        if(!user!.auth.password) throw new Error("User with specified email doesn't have the password. Please contact the support team.")

        const passwordMatch: boolean = await bcrypt.compare(password, user!.auth.password)
        if (!passwordMatch) throw new Error("Wrong password")

        const tokens = Service.generateTokens({id: user!.id, role: user!.role})
        await UserServiceHelper.updateCredentialsData(user!.id, {refreshToken: tokens.refreshToken})

        return tokens
    }

    static async logout(id: string): Promise<void> {
        await UserServiceHelper.updateCredentialsData(id, {refreshToken: undefined})
    }

    static async recoverPassword(resetToken: string, newPasswordData: RecoverPasswordDto): Promise<void> {

        const secret: string = process.env.RESET_PASSWORD_JWT as string;

        let email;
        try {
            const decoded = jwt.verify(resetToken, secret) as { email: string };
            email = decoded.email;
        } catch (e) {
            throw new Error("Wrong token.")
        }

        const user = await UserService.getByEmail(email)

        const {newPassword, confirmPassword} = newPasswordData;
        if (newPassword !== confirmPassword) throw new Error("Password confirmation failed. Please make sure both passwords match.")

        const hashedPassword = await this.hashPassword(newPassword)
        await UserServiceHelper.updateCredentialsData(user!.id, {password: hashedPassword})
    }

    static async updatePassword(newPasswordData: UpdatePasswordDto): Promise<void> {
        const {email, oldPassword, newPassword, confirmPassword} = newPasswordData;
        const user = await UserService.getByEmail(email)

        const currentPasswordIsCorrect = await bcrypt.compare(oldPassword, user!.auth.password)

        if (!currentPasswordIsCorrect) throw new Error("You entered an incorrect current password")

        if (oldPassword === newPassword) throw new Error("You have entered your current password in the \"new password\" field. ")

        if (newPassword !== confirmPassword) throw new Error("Password confirmation failed. Please make sure both passwords match.")

        const hashedPassword = await this.hashPassword(newPassword)

        await UserServiceHelper.updateCredentialsData(user!.id, {password: hashedPassword} )
    }

    static async resetPassword(requestResetData: ResetPasswordDto): Promise<string> {
        const {email} = requestResetData;

        const user = await UserService.getByEmail(email)

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
            to: user!.auth.email,
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

    static async hashPassword(password: string): Promise<string> {
        const salt = Number(process.env!.BCRYPT_SALT_ROUNDS ?? 10);
        return await bcrypt.hash(password, salt)
    }

    static generateTokens(payload: JwtPayload) {
        const accessTokenKey = process.env.ACCESS_TOKEN_SECRET;
        const refreshTokenKey = process.env.REFRESH_TOKEN_SECRET;

        if (!accessTokenKey || !refreshTokenKey) throw new Error("The private key was not found")

        const accessToken = jwt.sign(payload, accessTokenKey, {expiresIn: "15m"})
        const refreshToken = jwt.sign(payload, refreshTokenKey, {expiresIn: "30d"})

        return {accessToken, refreshToken}
    }

}


//------------------------------------------------------------------------------------------










export class ServiceHelper {






}