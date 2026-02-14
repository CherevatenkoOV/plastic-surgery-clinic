import {IsArray, IsNotEmpty, IsOptional, IsString, Length, ValidateNested} from "class-validator";
import { SlotDto} from "./slot.dto"
import { Type } from "class-transformer";

export class UpdateDoctorDto {
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
    @IsString()
    @Length(2, 50)
    @IsNotEmpty()
    specialization?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => SlotDto)
    doctorWeeklySlots?: SlotDto[];
}