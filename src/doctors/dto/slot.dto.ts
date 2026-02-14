import { Type } from "class-transformer";
import {IsDate, IsEnum, IsOptional, IsUUID} from "class-validator";

export enum Weekday {
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 7
}

export class SlotDto {
    @IsUUID()
    @IsOptional()
    id?: string;

    @IsEnum(Weekday)
    weekday: Weekday;

    @Type(() => Date)
    @IsDate()
    startAt: Date;

    @Type(() => Date)
    @IsDate()
    endAt: Date;
}