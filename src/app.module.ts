import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import {DoctorsModule} from "./doctors/doctors.module";
import { PatientsModule } from './patients/patients.module';
import { PatientsRepositoryService } from './shared/repositories/patients.repository.service';
import {DoctorsRepositoryService} from "./shared/repositories/doctors.repository.service";
import {UsersRepositoryService} from "./shared/repositories/users.repository.service";
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [UsersModule, PrismaModule, DoctorsModule, PatientsModule, AppointmentsModule],
  controllers: [AppController],
  providers: [AppService, UsersRepositoryService, DoctorsRepositoryService, PatientsRepositoryService],
})
export class AppModule {}
