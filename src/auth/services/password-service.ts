import bcrypt from "bcrypt";

export class PasswordService {
    constructor(
        private readonly saltRounds: number
    ) {}

    hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds)
    }

    verifyPassword(password: string, passwordHash: string): Promise<boolean> {
        return bcrypt.compare(password, passwordHash)
    }

    async validatePasswordChange(params: {
        currentPasswordHash: string,
        newPassword: string,
        confirmPassword: string
    }): Promise<void> {
        const { currentPasswordHash, newPassword, confirmPassword } = params;

        if (newPassword !== confirmPassword) {
            throw new Error("Password confirmation failed. Please make sure both passwords match.");
        }

        const isSameAsCurrent = await this.verifyPassword(newPassword, currentPasswordHash);
        if (isSameAsCurrent) {
            throw new Error("New password must be different from the current password.");
        }

    }
}