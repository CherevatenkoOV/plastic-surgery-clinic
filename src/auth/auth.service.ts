import {ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {HashService} from "./services/hash.service";
import {UsersRepositoryService} from "../users/users.repository.service";
import {PrismaService} from "../shared/prisma/prisma.service";
import {AuthMapper} from "./dto/auth.mapper";
import {AuthTokens, AuthUser} from "./auth.types";
import {TokenService} from "./services/token.service";
import {PatientsRepositoryService} from "../patients/patients.repository.service";
import {RegisterPatientDto} from "./dto/register-patient.dto";
import { MailService } from "../mail/mail.service";
import {InviteDoctorDto} from "./dto/invite-doctor.dto";
import {DoctorsRepositoryService} from "../doctors/doctors.repository.service";
import { DoctorInviteToken } from "src/doctors/doctors.types";
import { RegisterDoctorDto } from "./dto/register-doctor.dto";
import {UserRole} from "../generated/prisma/enums";
import { RecoverPasswordDto } from "./dto/recover-password.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { PasswordService } from "./services/password.service";
import { Role } from "src/users/users.types";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly tokenService: TokenService,
        private readonly mailService: MailService,
        private readonly hashService: HashService,
        private readonly passwordService: PasswordService,

        private readonly usersRepo: UsersRepositoryService,
        private readonly patientsRepo: PatientsRepositoryService,
        private readonly doctorsRepo: DoctorsRepositoryService
    ) {
    }

    async validateUser(email: string, password: string): Promise<AuthUser | null> {
        const credentialItem = await this.usersRepo.getAuthSubjectByEmail(this.prisma, email)
        if (!credentialItem) throw new UnauthorizedException("Invalid email or password")

        const valid = await this.passwordService.verify(password, credentialItem.passwordHash)
        if (!valid) throw new UnauthorizedException("Invalid email or password")

        const user = await this.usersRepo.findById(this.prisma, credentialItem.id)

        if (!user) throw new UnauthorizedException("Invalid email or password");

        return AuthMapper.toAuthUser(user)
    }

    async login(user: AuthUser): Promise<AuthTokens> {
        const payload = {sub: user.id, role: user.role}

        const tokens = this.tokenService.generateAuthTokens(payload)

        const refreshTokenHash = await this.hashService.hash(tokens.refreshToken)

        await this.usersRepo.updateCredentials(this.prisma, user.id, {refreshTokenHash})

        return tokens
    }

    async logout(user: AuthUser): Promise<void> {
        await this.usersRepo.clearRefreshToken(this.prisma, user.id)
    }

    async registerPatient(dto: RegisterPatientDto): Promise<AuthTokens> {
        const email = dto.email.trim().toLowerCase();
        const firstName = dto.firstName.trim();
        const lastName = dto.lastName.trim();
        const password = dto.password

        const passwordHash = await this.passwordService.hash(password)

        return this.prisma.$transaction(async (tx) => {
            const existing = await this.usersRepo.findByEmail(tx, email)
            if (existing) throw new ConflictException("User with specified email already exists.");

            const user = await this.usersRepo.create(tx, {
                firstName,
                lastName,
                role: UserRole.patient,
                auth: {email, passwordHash}
            })

            await this.patientsRepo.create(tx, {
                patientId: user.id, phone: dto.phone,
            })

            const tokens = this.tokenService.generateAuthTokens({sub: user.id, role: user.role as Role})

            const refreshTokenHash = await this.hashService.hash(tokens.refreshToken)

            await this.usersRepo.updateCredentials(tx, user.id, {refreshTokenHash})

            return tokens
        })
    }

    async inviteDoctor(dto: InviteDoctorDto): Promise<string | null> {
        const doctor = await this.usersRepo.findByEmail(this.prisma, dto.email);
        if (doctor) throw new ConflictException("User with specified email already exists.");

        const token = this.tokenService.generateDoctorInviteToken(dto.email);

        const result = await this.mailService.sendDoctorInviteLink({
            token,
            toEmail: dto.email,
        });

        return result.previewUrl ?? null;
    }

    async registerDoctor(token: DoctorInviteToken, dto: RegisterDoctorDto): Promise<AuthTokens> {
        const email = this.tokenService.verifyDoctorInviteToken(token)

        const firstName = dto.firstName.trim();
        const lastName = dto.lastName.trim();
        const specialization = dto.specialization.trim();
        const password = dto.password

        const passwordHash = await this.passwordService.hash(password)

        return this.prisma.$transaction(async (tx) => {
            const existing = await this.usersRepo.findByEmail(tx, email)
            if (existing) throw new ConflictException("User with specified email already exists.");

            const user = await this.usersRepo.create(tx, {
                firstName,
                lastName,
                role: UserRole.doctor,
                auth: {email, passwordHash}
            })

            await this.doctorsRepo.create(tx, {
                doctorId: user.id,
                specialization
            })

            const tokens = this.tokenService.generateAuthTokens({sub: user.id, role: user.role as Role})

            const refreshTokenHash = await this.hashService.hash(tokens.refreshToken)

            await this.usersRepo.updateCredentials(tx, user.id, {refreshTokenHash})

            return tokens
        })
    }

    async updatePassword(user: AuthUser, dto: UpdatePasswordDto): Promise<void> {
        const {oldPassword, newPassword, confirmPassword} = dto;
        console.log(user)
        return this.prisma.$transaction(async (tx) => {
            const authSubject = await this.usersRepo.getAuthSubjectByUserId(tx, user.id)
            if (!authSubject) throw new UnauthorizedException('Invalid credentials');

            const isValid = await this.passwordService.verify(oldPassword, authSubject.passwordHash)
            if (!isValid) throw new UnauthorizedException("Invalid credentials");

            await this.passwordService.validatePasswordChange({
                currentPasswordHash: authSubject.passwordHash,
                newPassword,
                confirmPassword
            })

            const passwordHash = await this.passwordService.hash(newPassword)
            await this.usersRepo.updateCredentials(tx, user.id, {passwordHash, refreshTokenHash: null})
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

    async recoverPassword(token: string, dto: RecoverPasswordDto): Promise<void> {
        const email = this.tokenService.verifyResetPasswordToken(token)

        const {newPassword, confirmPassword} = dto
        if (newPassword !== confirmPassword) throw new Error("Password confirmation failed. Please make sure both passwords match.")
        if (newPassword.length < 8) throw new Error("Password must be at least 8 characters long.");

        const passwordHash = await this.passwordService.hash(newPassword)
        return this.prisma.$transaction(async (tx) => {
            const user = await this.usersRepo.findByEmail(tx, email)
            if (!user) throw new NotFoundException("User not found")

            await this.usersRepo.updateCredentials(tx, user.id, {passwordHash, refreshTokenHash: null})

        })
    }
}

