import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class UpdatePasswordDto {
    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @IsStrongPassword()
    newPassword: string;

    @IsStrongPassword()
    confirmPassword: string;
}