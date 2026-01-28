import {IsEmail, IsEnum, IsString, IsStrongPassword, Length} from "class-validator";
import { UserRole } from "src/generated/prisma/enums";

/*
 1. Изменил структуру - вынес email и пароль из поля auth, чтобы получить плоский dto
 2. Переименовал поле passwordHash в password, поскольку от клиента приходит незахэшированный пароль
 */

export class CreateUserDto {
    @IsString()
    @Length(2, 50)
    firstName: string;

    @IsString()
    @Length(2, 50)
    lastName: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;
}