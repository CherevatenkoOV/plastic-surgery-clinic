import {IsOptional, IsPhoneNumber, IsString, Length} from "class-validator";

export class UpdatePatientDto {
    @IsOptional()
    @IsString()
    @Length(2, 50)
    firstName?: string;

    @IsOptional()
    @IsString()
    @Length(2, 50)
    lastName?: string;

    @IsOptional()
    @IsPhoneNumber()
    phone?: string;
}