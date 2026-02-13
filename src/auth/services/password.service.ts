import {Injectable} from "@nestjs/common";
import {HashService} from "./hash.service";

@Injectable()
export class PasswordService {
    constructor(private readonly hashService: HashService) {
    }

    hash(password: string): Promise<string> {
        return this.hashService.hash(password)
    }

    verify(password: string, passwordHash: string): Promise<boolean> {
        return this.hashService.compare(password, passwordHash)
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

        const isSameAsCurrent = await this.hashService.compare(newPassword, currentPasswordHash);
        if (isSameAsCurrent) {
            throw new Error("New password must be different from the current password.");
        }
    }
}