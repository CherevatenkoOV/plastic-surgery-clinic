import {IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, Length} from "class-validator";

export class RegisterPatientDto {
    @IsString()
    @Length(2, 50)
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @Length(2, 50)
    @IsNotEmpty()
    lastName: string;

    // TODO: default old passwords: 12345678 or 123456789
    // TODO: default password: Qwerty123!
    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;

    @IsOptional()
    @IsPhoneNumber()
    phone: string;
}