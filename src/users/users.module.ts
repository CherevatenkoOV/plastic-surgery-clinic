import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {PrismaService} from "../shared/prisma/prisma.service";
import {UsersRepositoryService} from "./users.repository.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UsersRepositoryService],
  exports: [UsersService, PrismaService, UsersRepositoryService]
})
export class UsersModule {}
