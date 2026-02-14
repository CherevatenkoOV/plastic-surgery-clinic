import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Request} from '@nestjs/common';
import {AppointmentsService} from './appointments.service';
import {GetAppointmentsQueryDto} from "./dto/get-appointments-query.dto";
import {AppointmentEntity} from "./appointments.types";
import {CreateAppointmentDto} from "./dto/create-appointment.dto";
import {UpdateAppointmentDto} from "./dto/update-appointment.dto";
import {Roles} from "../security/authorization/roles.decorator";
import {Role} from "../users/users.types";
import {JwtAuthGuard} from "../security/jwt/jwt-auth.guard";
import {RolesGuard} from "../security/authorization/roles.guard";

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) {
    }

    @Get()
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getMany(@Query() dto: GetAppointmentsQueryDto): Promise<AppointmentEntity[]> {
        return this.appointmentsService.getMany(dto)
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getById(@Param('id') id: string): Promise<AppointmentEntity> {
        return this.appointmentsService.getById(id)
    }

    @Get('my')
    @Roles(Role.DOCTOR, Role.PATIENT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getMy(@Request() req): Promise<AppointmentEntity[]> {
        return this.appointmentsService.getMy(req.user)
    }

    @Post()
    @Roles(Role.ADMIN, Role.PATIENT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async create(@Body() dto: CreateAppointmentDto): Promise<AppointmentEntity> {
        return this.appointmentsService.create(dto)
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async updateById(
        @Param('id') id: string,
        @Body() dto: UpdateAppointmentDto
    ): Promise<AppointmentEntity> {
        return this.appointmentsService.updateById(id, dto)
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async deleteById(@Param('id') id: string) {
        await this.appointmentsService.deleteById(id)
    }
}
