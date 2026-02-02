import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Query} from '@nestjs/common';
import {UsersService} from './users.service';
import type {UserPublic} from "./users.types";
import {UserMapper} from "./dto/user.mapper";
import {GetUsersQueryDto} from "./dto/get-users-query.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

/*
  1. В GET запросах filter - query, а не body. Это устоявшаяся практика
 */

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Get()
    async getAll(@Query() filter: GetUsersQueryDto): Promise<UserPublic[]> {
        const users = await this.usersService.getMany(filter);
        return UserMapper.toPublicList(users)
    }


    @Get(':id')
    async getById(@Param('id', ParseUUIDPipe) id: string): Promise<UserPublic> {
        const user = await this.usersService.getById(id)
        return UserMapper.toPublic(user)
    }

    @Patch(':id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateUserDto
    ): Promise<UserPublic> {
        const user = await this.usersService.update(id, dto)
        return UserMapper.toPublic(user)
    }

    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
      await this.usersService.delete(id)
    }


}
