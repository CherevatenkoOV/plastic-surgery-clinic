import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import {PatientsRepositoryService} from "./patients.repository.service";
import {UsersRepositoryService} from "../users/users.repository.service";

@Module({
  controllers: [PatientsController],
  providers: [PatientsService, PatientsRepositoryService, UsersRepositoryService],
  exports: [PatientsService, PatientsRepositoryService, UsersRepositoryService]
})
export class PatientsModule {}
