import {IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length} from "class-validator";

export class RegisterDoctorDto {
    @IsString()
    @Length(2, 50)
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @Length(2, 50)
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;

    @IsString()
    @Length(2, 50)
    @IsNotEmpty()
    specialization: string;
}