import {
    AuthTokens, LoginDto,
    RecoverPasswordDto, RegisterDoctorDto,
    RegisterPatientDto,
    UpdatePasswordDto,
} from "./types.js";
import {Role} from "../shared/roles.js";
import {IUsersRepository} from "../users/repository/i-users-repository";
import {IDoctorsRepository} from "../doctors/repository/i-doctors-repository";
import {IPatientsRepository} from "../patients/repository/i-patients-repository";
import {PrismaClient} from "../generated/prisma/client";
import {PasswordService} from "./services/password-service";
import {TokenService} from "./services/token-service";
import {MailService} from "./services/mail-service";
import {DoctorInviteToken} from "../doctors";

export class AuthFlow {
    constructor(
        private readonly passwordService: PasswordService,
        private readonly tokenService: TokenService,
        private readonly mailService: MailService,
        private readonly usersRepo: IUsersRepository,
        private readonly doctorsRepo: IDoctorsRepository,
        private readonly patientsRepo: IPatientsRepository,
        private readonly prisma: PrismaClient
    ) {
    }

    async registerPatient(patientData: RegisterPatientDto): Promise<AuthTokens> {
        const email = patientData.email.trim().toLowerCase();
        const firstName = patientData.firstName.trim();
        const lastName = patientData.lastName.trim();
        const password = patientData.password

        const passwordHash = await this.passwordService.hashPassword(password)

        return this.prisma.$transaction(async (tx) => {
            const existing = await this.usersRepo.findByEmail(email, tx)
            if (existing) throw new Error("User with specified email already exists.");

            const user = await this.usersRepo.create({
                firstName,
                lastName,
                role: Role.PATIENT,
                auth: {email, passwordHash}
            }, tx)

            await this.patientsRepo.create({
                patientId: user.id, phone: patientData.phone,
            }, tx)

            const tokens = this.tokenService.generateAuthTokens({id: user.id, role: user.role})

            await this.usersRepo.updateCredentials(user.id, {refreshToken: tokens.refreshToken}, tx)

            return tokens
        })
    }

    async inviteDoctor(email: string): Promise<string | null> {
        const doctor = await this.usersRepo.findByEmail(email, this.prisma);
        if (doctor) throw new Error("User with specified email already exists.");

        const token = this.tokenService.generateDoctorInviteToken(email);

        const result = await this.mailService.sendDoctorInviteLink({
            token,
            toEmail: email,
        });

        return result.previewUrl ?? null;
    }

    async registerDoctor(token: DoctorInviteToken, doctorData: RegisterDoctorDto): Promise<AuthTokens> {
        const email = this.tokenService.verifyDoctorInviteToken(token)

        const firstName = doctorData.firstName.trim();
        const lastName = doctorData.lastName.trim();
        const specialization = doctorData.specialization.trim();
        const password = doctorData.password

        const passwordHash = await this.passwordService.hashPassword(password)

        return this.prisma.$transaction(async (tx) => {
            const existing = await this.usersRepo.findByEmail(email, tx)
            if (existing) throw new Error("User with specified email already exists.");

            const user = await this.usersRepo.create({
                firstName,
                lastName,
                role: Role.DOCTOR,
                auth: {email, passwordHash}
            }, tx)

            await this.doctorsRepo.create({
                doctorId: user.id,
                specialization
            }, tx)

            const tokens = this.tokenService.generateAuthTokens({id: user.id, role: user.role})

            await this.usersRepo.updateCredentials(user.id, {refreshToken: tokens.refreshToken}, tx)

            return tokens
        })
    }

    async login(loginData: LoginDto): Promise<AuthTokens> {
        const {email, password} = loginData;

        return this.prisma.$transaction(async (tx) => {
            const authSubject = await this.usersRepo.getAuthSubjectByEmail(email, tx)
            if (!authSubject) throw new Error("Invalid email or password");

            const isValid = await this.passwordService.verifyPassword(password, authSubject!.passwordHash)
            if (!isValid) throw new Error("Invalid email or password");

            const tokens = this.tokenService.generateAuthTokens({id: authSubject.id, role: authSubject.role})

            await this.usersRepo.updateCredentials(authSubject.id, {refreshToken: tokens.refreshToken}, tx)

            return tokens
        })
    }

    async logout(id: string): Promise<void> {
        await this.usersRepo.updateCredentials(id, {refreshToken: null}, this.prisma)
    }

    async recoverPassword(resetPasswordToken: string, newPasswordData: RecoverPasswordDto): Promise<void> {
        const email = this.tokenService.verifyResetPasswordToken(resetPasswordToken)

        const {newPassword, confirmPassword} = newPasswordData
        if (newPassword !== confirmPassword) throw new Error("Password confirmation failed. Please make sure both passwords match.")
        if (newPassword.length < 8) throw new Error("Password must be at least 8 characters long.");

        const passwordHash = await this.passwordService.hashPassword(newPassword)
        return this.prisma.$transaction(async (tx) => {
            const user = await this.usersRepo.findByEmail(email, tx)

            await this.usersRepo.updateCredentials(user.id, {passwordHash, refreshToken: null}, tx)

        })
    }

    async updatePassword(userId: string, newPasswordData: UpdatePasswordDto): Promise<void> {
        const {oldPassword, newPassword, confirmPassword} = newPasswordData;
        return this.prisma.$transaction(async (tx) => {
            const authSubject = await this.usersRepo.getAuthSubjectById(userId, tx)
            if (!authSubject) throw new Error("Invalid credentials");

            const isValid = await this.passwordService.verifyPassword(oldPassword, authSubject.passwordHash)
            if (!isValid) throw new Error("Invalid credentials");

            await this.passwordService.validatePasswordChange({
                currentPasswordHash: authSubject.passwordHash,
                newPassword,
                confirmPassword
            })

            const passwordHash = await this.passwordService.hashPassword(newPassword)
            await this.usersRepo.updateCredentials(userId, {passwordHash, refreshToken: null}, tx)
        })
    }

    async resetPassword(email: string): Promise<string | null> {
        const resetPasswordToken = await this.tokenService.generateResetPasswordToken(email)

        const result = await this.mailService.sendResetPasswordLink({
            token: resetPasswordToken,
            toEmail: email
        });

        return result.previewUrl ?? null;
    }

}