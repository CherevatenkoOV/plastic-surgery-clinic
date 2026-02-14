import {IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length} from "class-validator";

export class UpdatePatientDto {
    @IsOptional()
    @IsString()
    @Length(2, 50)
    @IsNotEmpty()
    firstName?: string;

    @IsOptional()
    @IsString()
    @Length(2, 50)
    @IsNotEmpty()
    lastName?: string;

    @IsOptional()
    @IsPhoneNumber()
    phone?: string;
}