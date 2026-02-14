import {IsOptional, IsString, Length} from "class-validator";

export class GetDoctorsQueryDto {
    @IsOptional()
    @IsString()
    @Length(2, 50)
    firstName?: string;

    @IsOptional()
    @IsString()
    @Length(2, 50)
    lastName?: string;

    @IsOptional()
    @IsString()
    @Length(2, 50)
    specialization?: string;
}