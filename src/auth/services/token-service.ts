import {Role} from "../../shared/roles";
import {AuthTokens} from "../types";
import jwt from "jsonwebtoken";

export class TokenService {
    constructor(
        private readonly accessSecret: string,
        private readonly refreshSecret: string,
        private readonly resetPasswordSecret: string,
        private readonly doctorInviteSecret: string
    ) {
    }

    generateAuthTokens(payload: { id: string, role: Role }): AuthTokens {
        const accessToken = jwt.sign(payload, this.accessSecret, {expiresIn: "15m"})
        const refreshToken = jwt.sign(payload, this.refreshSecret, {expiresIn: "30d"})
        return {accessToken, refreshToken}
    }

    // ===== RESET PASSWORD =====

    generateResetPasswordToken(email: string): string {
        return jwt.sign({email}, this.resetPasswordSecret, {expiresIn: "10m"})
    }

    verifyResetPasswordToken(token: string): string {
            const decoded = jwt.verify(token, this.resetPasswordSecret) as { email?: string }
            if (!decoded.email) throw new Error("Invalid or expired reset password token")
            return decoded.email
    }

    // ===== DOCTOR INVITE =====

    generateDoctorInviteToken(email: string): string {
        return jwt.sign({email}, this.doctorInviteSecret, {expiresIn: "24h"})
    }

    verifyDoctorInviteToken(token: string): string {
            const decoded = jwt.verify(token, this.doctorInviteSecret) as { email?: string }
            if (!decoded.email) throw new Error("Invalid or expired doctor invite token")
            return decoded.email

    }

}