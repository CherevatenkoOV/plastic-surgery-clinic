import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Query} from '@nestjs/common';
import { PatientsService } from './patients.service';
import {GetPatientsQueryDto} from "./dto/get-patients-query.dto";
import { PatientWithUser } from "./patients.types";
import {UpdatePatientDto} from "./dto/update-patient.dto";

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  async getMany(@Query() query: GetPatientsQueryDto): Promise<PatientWithUser[]> {
    return this.patientsService.getPatients(query)
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientsService.getPatientById(id)
  }

  // TODO: реализовать после реализации авторизации
  // @Get('me')
  // async getMe(){}


  @Patch(':id')
  async updateById(
      @Param('id') id: string,
      @Body() dto: UpdatePatientDto
  ): Promise<PatientWithUser> {
    return this.patientsService.updatePatient(id, dto)
  }

  // TODO: реализовать после реализации авторизации
  // @Patch('me')
  // async updateMe(){}

  @Delete(':id')
  async delete(@Param(':id') id: string): Promise<void> {
    await this.patientsService.deletePatient(id)
  }

  // TODO: реализовать после реализации авторизации
  // @Delete('me')
  // async deleteMe(){}

}
