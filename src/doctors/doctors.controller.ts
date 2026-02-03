import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Query} from "@nestjs/common";
import {DoctorsService} from "./doctors.service";
import {GetDoctorsQueryDto} from "./dto/get-doctors-query.dto";
import { DoctorWithUser } from "./types";
import {UpdateDoctorDto} from "./dto/update-doctor.dto";

@Controller('doctors')
export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) {}

    @Get()
    async getMany(@Query() query: GetDoctorsQueryDto): Promise<DoctorWithUser[]> {
        return this.doctorsService.getDoctors(query)
    }

    @Get(':id')
    async getById(@Param('id', ParseUUIDPipe) id: string): Promise<DoctorWithUser> {
        return this.doctorsService.getDoctorById(id)
    }

    // TODO: реализовать после реализации авторизации
    // @Get('me')
    // async getMe(){}

    @Patch(':id')
    async updateById(
        @Param('id') id: string,
        @Body() dto: UpdateDoctorDto
    ): Promise<DoctorWithUser> {
        return this.doctorsService.updateDoctor(id, dto)
    }

    // TODO: реализовать после реализации авторизации
    // @Patch('me')
    // async updateMe(){}

    @Delete(':id')
    async deleteById(@Param('id') id: string) {
        await this.doctorsService.deleteDoctor(id)
    }

    // TODO: реализовать после реализации авторизации
    // @Delete('me')
    // async deleteMe(){}

}