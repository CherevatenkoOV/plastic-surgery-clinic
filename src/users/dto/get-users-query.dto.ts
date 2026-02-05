import {IsNotEmpty, IsOptional, IsString, Length} from "class-validator";

export class GetUsersQueryDto {
    @IsOptional()
    @IsString()
    @Length(2, 50)
    @IsNotEmpty()
    firstName?: string;

    @IsOptional()
    @IsString()
    @Length(2, 50)ё
    @IsNotEmpty()
    lastName?: string;
}