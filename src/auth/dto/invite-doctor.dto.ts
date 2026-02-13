import {IsEmail} from "class-validator";

export class InviteDoctorDto {
    @IsEmail()
    email: string;
}