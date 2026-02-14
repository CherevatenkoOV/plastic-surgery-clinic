import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Query, UseGuards} from '@nestjs/common';
import {UsersService} from './users.service';
import {Role, UserPublic} from "./users.types";
import {GetUsersQueryDto} from "./dto/get-users-query.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {GetUserByEmailDto} from "./dto/get-user-by-email.dto";
import { JwtAuthGuard } from "src/security/jwt/jwt-auth.guard";
import {Roles} from "../security/authorization/roles.decorator";
import {RolesGuard} from "../security/authorization/roles.guard";

/*
  1. В GET запросах filter - query, а не body. Это устоявшаяся практика
 */

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Get()
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getMany(@Query() query: GetUsersQueryDto): Promise<UserPublic[]> {
       return this.usersService.getMany(query);

    }

    @Get(':id')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getById(@Param('id', ParseUUIDPipe) id: string): Promise<UserPublic> {
        return this.usersService.getById(id)
    }

    @Get()
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getByEmail(@Param('email') query: GetUserByEmailDto): Promise<UserPublic> {
        return this.usersService.getByEmail(query.email)
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateUserDto
    ): Promise<UserPublic> {
        return this.usersService.updateById(id, dto)
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
      await this.usersService.deleteById(id)
    }


}
