import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {AppointmentsService} from './appointments.service';
import {GetAppointmentsQueryDto} from "./dto/get-appointments-query.dto";
import {AppointmentEntity} from "./appointments.types";
import {CreateAppointmentDto} from "./dto/create-appointment.dto";
import {UpdateAppointmentDto} from "./dto/update-appointment.dto";

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) {
    }

    @Get()
    async getMany(@Query() dto: GetAppointmentsQueryDto): Promise<AppointmentEntity[]> {
        return this.appointmentsService.getAppointments(dto)
    }

    @Get(':id')
    async getById(@Param('id') id: string): Promise<AppointmentEntity> {
        return this.appointmentsService.getAppointmentById(id)
    }

    @Post()
    async create(@Body() dto: CreateAppointmentDto): Promise<AppointmentEntity> {
        return this.appointmentsService.createAppointment(dto)
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateAppointmentDto
    ): Promise<AppointmentEntity> {
        return this.appointmentsService.updateAppointment(id, dto)
    }

    @Delete('id')
    async delete(@Param('id') id: string) {

    }
}
