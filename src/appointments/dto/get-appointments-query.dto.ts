import {IsOptional, IsUUID} from "class-validator";

export class GetAppointmentsQueryDto {
    @IsOptional()
    @IsUUID()
    doctorId?: string;

    @IsOptional()
    @IsUUID()
    patientId?: string;
}