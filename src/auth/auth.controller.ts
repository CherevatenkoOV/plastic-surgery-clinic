import {Controller, Post, UseGuards, Request, Body, Res, Param} from "@nestjs/common";
import type {Response,} from "express";
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {AuthService} from "./auth.service";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {RegisterPatientDto} from "./dto/register-patient.dto";
import {ConfigService} from "@nestjs/config";
import {InviteDoctorDto} from "./dto/invite-doctor.dto";
import {RegisterDoctorDto} from "./dto/register-doctor.dto";
import {RecoverPasswordDto} from "./dto/recover-password.dto";
import {UpdatePasswordDto} from "./dto/update-password.dto";
import {ResetPasswordDto} from "./dto/reset-password.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService
    ) {
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Request() req) {
        await this.authService.logout(req.user);
        return {message: 'Logged out successfully'};
    }

    @Post('register/patient')
    async registerPatient(
        @Body() dto: RegisterPatientDto,
        @Res({passthrough: true}) res: Response
    ) {
        const {accessToken, refreshToken} = await this.authService.registerPatient(dto)

        res.cookie("refreshToken", refreshToken, {
            secure: false,
            httpOnly: true,
            maxAge: Number(this.configService.getOrThrow("REFRESH_COOKIE_MAX_AGE_MS")),
            sameSite: "strict",
        });

        return {accessToken};
    }

    @Post('/invite/doctor')
    async inviteDoctor(@Body() dto: InviteDoctorDto) {
        return this.authService.inviteDoctor(dto)
    }

    @Post('/register/doctor/:token')
    async registerDoctor(
        @Param('token') token: string,
        @Body() dto: RegisterDoctorDto,
        @Res({passthrough: true}) res: Response
    ) {
        const {accessToken, refreshToken} = await this.authService.registerDoctor(token, dto);

        res.cookie("refreshToken", refreshToken, {
            secure: false,
            httpOnly: true,
            maxAge: Number(this.configService.getOrThrow("REFRESH_COOKIE_MAX_AGE_MS")),
            sameSite: "strict",
        });

        return {accessToken};
    }

    @UseGuards(JwtAuthGuard)
    @Post('/password/update')
    async updatePassword(
        @Request() req,
        @Body() dto: UpdatePasswordDto,
        @Res({passthrough: true}) res: Response
    ) {
        await this.authService.updatePassword(req.user, dto);

        res.clearCookie("refreshToken", {
            secure: true,
            httpOnly: true,
            sameSite: "strict",
        });

        return {message: "Password was changed successfully"}
    }

    @Post('/password/reset')
    async resetPassword(@Body() dto: ResetPasswordDto) {

        const previewUrl = await this.authService.resetPassword(dto.email);

        return {
            message: "Link for changing password was sent to email",
            previewUrl,
        };
    }

    @Post('/password/recover/:resetToken')
    async recoverPassword(
        @Param('resetToken') token: string,
        @Body() dto: RecoverPasswordDto,
        @Res({passthrough: true}) res: Response
    ) {

        await this.authService.recoverPassword(token, dto);

        res.clearCookie("refreshToken", {
            secure: true,
            httpOnly: true,
            sameSite: "strict",
        });

        return {message: "New password was set successfully"}
    }


}