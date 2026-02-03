import { IsOptional, IsString, Length} from "class-validator";

export class GetUsersQueryDto {
    @IsOptional()
    @IsString()
    @Length(2, 50)
    firstName?: string;

    @IsOptional()
    @IsString()
    @Length(2, 50)
    lastName?: string;
}