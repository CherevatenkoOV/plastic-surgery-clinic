import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {UsersRepositoryService} from "./users.repository.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepositoryService],
  exports: [UsersService, UsersRepositoryService]
})
export class UsersModule {}
