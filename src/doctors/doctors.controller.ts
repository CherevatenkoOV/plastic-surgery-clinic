import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Query, UseGuards, Request} from "@nestjs/common";
import {DoctorsService} from "./doctors.service";
import {GetDoctorsQueryDto} from "./dto/get-doctors-query.dto";
import {DoctorWithUser} from "./doctors.types";
import {UpdateDoctorDto} from "./dto/update-doctor.dto";
import {Roles} from "src/security/authorization/roles.decorator";
import {Role} from "../users/users.types";
import { RolesGuard } from "src/security/authorization/roles.guard";
import {JwtAuthGuard} from "../security/jwt/jwt-auth.guard";

@Controller('doctors')
export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) {}

    @Get()
    @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getMany(@Query() query: GetDoctorsQueryDto): Promise<DoctorWithUser[]> {
        return this.doctorsService.getMany(query)
    }


    @Get('me')
    @Roles(Role.DOCTOR)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getMe(
        @Request() req
    ) {
        return this.doctorsService.getById(req.user.id)
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.PATIENT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getById(@Param('id', ParseUUIDPipe) id: string): Promise<DoctorWithUser> {
        return this.doctorsService.getById(id)
    }

    @Patch('me')
    @Roles(Role.DOCTOR)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async updateMe(
        @Request() req,
        @Body() dto: UpdateDoctorDto
    ): Promise<DoctorWithUser> {
        return this.doctorsService.updateById(req.user.id, dto)
    }


    @Patch(':id')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async updateById(
        @Param('id') id: string,
        @Body() dto: UpdateDoctorDto
    ): Promise<DoctorWithUser> {
        return this.doctorsService.updateById(id, dto)
    }

    @Delete('me')
    @Roles(Role.DOCTOR)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async deleteMe(@Request() req): Promise<void> {
        await this.doctorsService.deleteById(req.user.id)
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async deleteById(@Param('id') id: string): Promise<void> {
        await this.doctorsService.deleteById(id)
    }
}