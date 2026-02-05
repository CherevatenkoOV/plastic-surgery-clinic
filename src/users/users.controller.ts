import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Query} from '@nestjs/common';
import {UsersService} from './users.service';
import type {UserPublic} from "./users.types";
import {UserMapper} from "./dto/user.mapper";
import {GetUsersQueryDto} from "./dto/get-users-query.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {GetUserByEmailDto} from "./dto/get-user-by-email.dto";

/*
  1. В GET запросах filter - query, а не body. Это устоявшаяся практика
 */

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Get()
    async getMany(@Query() query: GetUsersQueryDto): Promise<UserPublic[]> {
       return this.usersService.getMany(query);

    }

    @Get(':id')
    async getById(@Param('id', ParseUUIDPipe) id: string): Promise<UserPublic> {
        return this.usersService.getById(id)
    }

    @Get()
    async getByEmail(@Param('email') query: GetUserByEmailDto): Promise<UserPublic> {
        return this.usersService.getByEmail(query.email)
    }

    @Patch(':id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateUserDto
    ): Promise<UserPublic> {
        return this.usersService.update(id, dto)
    }

    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
      await this.usersService.delete(id)
    }


}
