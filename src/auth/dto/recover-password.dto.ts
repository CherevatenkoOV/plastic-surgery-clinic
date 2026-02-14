import {IsStrongPassword} from "class-validator";

export class RecoverPasswordDto {
    @IsStrongPassword()
    newPassword: string;

    @IsStrongPassword()
    confirmPassword: string;
}