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
}