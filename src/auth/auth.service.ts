import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {HashService} from "./hash.service";
import {UsersRepositoryService} from "../shared/repositories/users.repository.service";
import {PrismaService} from "../shared/prisma/prisma.service";
import {AuthMapper} from "./dto/auth.mapper";
import {AuthUser} from "./auth.types";
import {JwtService} from "@nestjs/jwt";
import {TokenService} from "./token.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly tokenService: TokenService,
        private readonly usersService: UsersService,
        private readonly passwordService: HashService,
        private readonly usersRepo: UsersRepositoryService
    ) {
    }

    async validateUser(email: string, password: string): Promise<AuthUser | null> {
        const credentialItem = await this.usersService.getAuthSubjectByEmail(email)
        if (!credentialItem) throw new UnauthorizedException("Invalid email or password")

        const valid = await this.passwordService.compare(password, credentialItem.passwordHash)
        if (!valid) throw new UnauthorizedException("Invalid email or password")

        const user = await this.usersRepo.findById(this.prisma, credentialItem.id)

        if (!user) throw new UnauthorizedException("Invalid email or password");

        return AuthMapper.toAuthUser(user)
    }

    async login(user: AuthUser) {
        const payload = {sub: user.id, role: user.role}

        const tokens = this.tokenService.generateAuthTokens(payload)

        await this.usersRepo.updateCredentials(this.prisma, user.id, {refreshToken: tokens.refreshToken})

        return tokens
    }


}

