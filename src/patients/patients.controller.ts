import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
  Request
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import {GetPatientsQueryDto} from "./dto/get-patients-query.dto";
import { PatientWithUser } from "./patients.types";
import {UpdatePatientDto} from "./dto/update-patient.dto";
import {Roles} from "../security/authorization/roles.decorator";
import {Role} from "../users/users.types";
import {JwtAuthGuard} from "../security/jwt/jwt-auth.guard";
import {RolesGuard} from "../security/authorization/roles.guard";

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getMany(@Query() query: GetPatientsQueryDto): Promise<PatientWithUser[]> {
    return this.patientsService.getMany(query)
  }

  @Get('me')
  @Roles(Role.PATIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getMe(@Request() req) {
    return this.patientsService.getById(req.user.id)
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientsService.getById(id)
  }


  @Patch('me')
  @Roles(Role.PATIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateMe(
      @Request() req,
      @Body() dto: UpdatePatientDto
  ): Promise<PatientWithUser> {
    return this.patientsService.updateById(req.user.id, dto)
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateById(
      @Param('id') id: string,
      @Body() dto: UpdatePatientDto
  ): Promise<PatientWithUser> {
    return this.patientsService.updateById(id, dto)
  }


  @Delete('me')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteMe(@Request() req): Promise<void> {
    await this.patientsService.deleteById(req.user.id)
  }


  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteById(@Param(':id') id: string): Promise<void> {
    await this.patientsService.deleteById(id)
  }
}
