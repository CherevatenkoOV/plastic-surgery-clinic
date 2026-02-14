import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {UsersModule} from "../users/users.module";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./local.strategy";
import {HashService} from "./services/hash.service";
import {AuthController} from "./auth.controller";
import {LocalAuthGuard} from "./local-auth.guard";
import {JwtModule} from "@nestjs/jwt";
import { JwtStrategy } from "../security/jwt/jwt.strategy";
import {TokenService} from "./services/token.service";
import {ConfigModule} from "@nestjs/config";
import {PatientsModule} from "../patients/patients.module";
import { MailService } from "../mail/mail.service";
import {DoctorsModule} from "../doctors/doctors.module";
import {PasswordService} from "./services/password.service";

@Module({
    controllers: [AuthController],
    imports: [
        UsersModule,
        PatientsModule,
        DoctorsModule,
        PassportModule,
        JwtModule.register({}),
        ConfigModule
    ],
    providers: [
        AuthService,
        LocalStrategy,
        HashService,
        LocalAuthGuard,
        JwtStrategy,
        TokenService,
        MailService,
        PasswordService
    ]
})
export class AuthModule {
}
