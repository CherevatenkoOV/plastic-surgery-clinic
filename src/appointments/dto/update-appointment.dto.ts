import {IsISO8601, IsNotEmpty, IsString, IsUUID, Length} from "class-validator";

export class UpdateAppointmentDto {
    @IsUUID()
    doctorId: string;

    @IsUUID()
    patientId: string;

    @IsString()
    @Length(2, 50)
    @IsNotEmpty()
    serviceName: string;

    @IsISO8601()
    startsAt: string;
}