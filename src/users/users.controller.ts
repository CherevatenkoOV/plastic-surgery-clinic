import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserPublic } from "./users.types";
import {UserMapper} from "./dto/user.mapper";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(): Promise<UserPublic[]> {
    const users = await this.usersService.get();
    return UserMapper.toPublicList(users)
  }

}
