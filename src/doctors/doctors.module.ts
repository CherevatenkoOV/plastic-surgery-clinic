import { Module } from "@nestjs/common";
import {DoctorsService} from "./doctors.service";
import { DoctorsController } from "./doctors.controller";
import {DoctorsRepositoryService} from "../shared/repositories/doctors.repository.service";
import {UsersRepositoryService} from "../shared/repositories/users.repository.service";

@Module({
    controllers: [DoctorsController],
    providers: [DoctorsService, DoctorsRepositoryService, UsersRepositoryService],
    exports: [DoctorsService, DoctorsRepositoryService, UsersRepositoryService]
})

export class DoctorsModule{}