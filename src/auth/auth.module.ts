import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {UsersModule} from "../users/users.module";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./strategies/local.strategy";
import {HashService} from "./hash.service";
import {AuthController} from "./auth.controller";
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {JwtModule} from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import {TokenService} from "./token.service";
import {ConfigModule} from "@nestjs/config";

@Module({
    controllers: [AuthController],
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({}),
        ConfigModule
    ],
    providers: [AuthService, LocalStrategy, HashService, LocalAuthGuard, JwtStrategy, TokenService]
})
export class AuthModule {
}
