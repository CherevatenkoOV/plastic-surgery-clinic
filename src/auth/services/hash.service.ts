import bcrypt from "bcrypt";
import {ConfigService} from "@nestjs/config";
import {Injectable} from "@nestjs/common";

@Injectable()
export class HashService {
    constructor(
    private readonly configService: ConfigService
    ) {}

    async hash(plain: string): Promise<string> {
        const salt = Number(this.configService.get<string>('BCRYPT_SALT_ROUNDS'))
        return await bcrypt.hash(plain, Number(salt))
    }

    async compare(plain: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(plain, hash)
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