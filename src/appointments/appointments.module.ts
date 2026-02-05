import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import {AppointmentsRepositoryService} from "../shared/repositories/appointments.repository.service";
import {DoctorsRepositoryService} from "../shared/repositories/doctors.repository.service";
import {PatientsRepositoryService} from "../shared/repositories/patients.repository.service";

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentsRepositoryService, DoctorsRepositoryService, PatientsRepositoryService],
  exports: [AppointmentsService, AppointmentsRepositoryService, DoctorsRepositoryService, PatientsRepositoryService]
})
export class AppointmentsModule {}
