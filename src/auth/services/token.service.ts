import {JwtService} from "@nestjs/jwt";
import { AuthTokens } from "../auth.types";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Role } from "src/users/users.types";

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private configService: ConfigService
    ) {
    }

    generateAuthTokens(payload: { sub: string, role: Role }): AuthTokens {
        const accessToken = this.jwtService.sign(
            payload,
            {
                secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
                expiresIn: "15m"
            })

        const refreshToken = this.jwtService.sign(
            payload,
            {
                secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
                expiresIn: "30d"
            })

        return {accessToken, refreshToken}
    }

    generateResetPasswordToken(email: string): string {
        return this.jwtService.sign(
            {email: email},
            {
                secret: this.configService.get<string>('RESET_PASSWORD_SECRET'),
                expiresIn: "10m"
            })
    }

    verifyResetPasswordToken(token: string): string {
        const decoded = this.jwtService.verify(
            token,
            {secret: this.configService.get<string>('RESET_PASSWORD_SECRET')})
        if(!decoded.email) throw new UnauthorizedException("Invalid or expired reset password token")
        return decoded.email
    }


    generateDoctorInviteToken(email: string): string {
        return this.jwtService.sign(
            {email},
            {
                secret: this.configService.get<string>('DOCTOR_INVITE_SECRET'),
                expiresIn: "24h"
            })
    }


    verifyDoctorInviteToken(token: string): string {
        const decoded = this.jwtService.verify(
            token,
            {secret: this.configService.get<string>('DOCTOR_INVITE_SECRET')}
        )
        if(!decoded.email) throw new UnauthorizedException("Invalid or expired reset password token")
        return decoded.email
    }

}