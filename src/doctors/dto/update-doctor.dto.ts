import {IsArray, IsOptional, IsString, Length, ValidateNested} from "class-validator";
import { SlotDto} from "./slot.dto"
import { Type } from "class-transformer";

export class UpdateDoctorDto {
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

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => SlotDto)
    doctorWeeklySlots?: SlotDto[];
}