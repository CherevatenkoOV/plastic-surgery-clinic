import bcrypt from "bcrypt";

export class HashService {
    constructor(
        private readonly saltRounds: number
    ) {}

    async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds)
    }

    async compare(password: string, passwordHash: string): Promise<boolean> {
        return await bcrypt.compare(password, passwordHash)
    }

    // TODO: delete from here and use logic directly in service method
    // async validatePasswordChange(params: {
    //     currentPasswordHash: string,
    //     newPassword: string,
    //     confirmPassword: string
    // }): Promise<void> {
    //     const { currentPasswordHash, newPassword, confirmPassword } = params;
    //
    //     if (newPassword !== confirmPassword) {
    //         throw new Error("Password confirmation failed. Please make sure both passwords match.");
    //     }
    //
    //     const isSameAsCurrent = await this.compare(newPassword, currentPasswordHash);
    //     if (isSameAsCurrent) {
    //         throw new Error("New password must be different from the current password.");
    //     }
    // }
}