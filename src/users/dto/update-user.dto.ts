import { IsOptional, IsString, Length} from "class-validator";

/*
 1. Изменил структуру - убрал из updateUserDto credentials
 */

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @Length(2, 50)
    firstName?: string;

    @IsOptional()
    @IsString()
    @Length(2, 50)
    lastName?: string;
}