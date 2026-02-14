import { Module } from '@nestjs/common';
import {JwtAuthGuard} from "./jwt/jwt-auth.guard";
import {RolesGuard} from "./authorization/roles.guard";

@Module({
providers: [JwtAuthGuard, RolesGuard],
    exports: [JwtAuthGuard, RolesGuard]
})
export class SecurityModule {}
