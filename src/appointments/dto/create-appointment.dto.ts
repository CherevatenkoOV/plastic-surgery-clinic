import {IsDate, IsNotEmpty, IsString, IsUUID, Length} from "class-validator";

export class CreateAppointmentDto {
    @IsUUID()
    doctorId: string;

    @IsUUID()
    patientId: string;

    @IsString()
    @Length(2, 50)
    @IsNotEmpty()
    serviceName: string;

    @IsDate()
    startsAt: string;
}