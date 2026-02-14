import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import {DoctorsModule} from "./doctors/doctors.module";
import { PatientsModule } from './patients/patients.module';
import { PatientsRepositoryService } from './patients/patients.repository.service';
import {DoctorsRepositoryService} from "./doctors/doctors.repository.service";
import {UsersRepositoryService} from "./users/users.repository.service";
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from "@nestjs/config";
import { SecurityModule } from './security/security.module';

@Module({
  imports: [UsersModule, PrismaModule, DoctorsModule, PatientsModule, AppointmentsModule, AuthModule, ConfigModule.forRoot(), SecurityModule],
  controllers: [AppController],
  providers: [
      AppService,
      UsersRepositoryService,
      DoctorsRepositoryService,
      PatientsRepositoryService],
})
export class AppModule {}
