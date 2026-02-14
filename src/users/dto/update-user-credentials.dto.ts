import {IsEmail, IsOptional, IsString, IsStrongPassword, ValidateIf} from "class-validator";

/*
 1. Переименовал поле passwordHash в password, поскольку от клиента приходит незахэшированный пароль
 */

export class UpdateUserCredentialsDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsStrongPassword()
    password?: string;

    @IsOptional()
    @ValidateIf((_, value ) => value !== null)
    @IsString()
    refreshToken?: string | null;
}