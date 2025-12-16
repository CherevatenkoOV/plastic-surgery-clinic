import {Request, Response} from "express";
import {
    UsersParams,
    UpdateUserDto, UserDto
} from "./types.js";
import {UsersService} from "./service.js";
import {Role} from "../shared/roles.js";
import {sanitizeUsers} from "./helpers/sanitize-users.js";
import {sanitizeUser} from "./helpers/sanitize-user.js";

export class UsersController {
    constructor(private readonly usersService: UsersService){}

    async getAll(req: Request, res: Response<UserDto[]>): Promise<void> {
        const users = await this.usersService.get();
        const publicUsers = sanitizeUsers(users)

        res.status(200).send(publicUsers)
    }

    async getById(req: Request<UsersParams>, res: Response<UserDto | { message: string }>): Promise<void> {
        const id = req.params.id;
        const user = await this.usersService.getById(id)

        const publicUser = sanitizeUser(user!)

        res.status(200).send(publicUser)
    }

    async getByEmail(req: Request<{}, {}, {}, { email: string }>, res: Response<UserDto | {
        message: string
    }>): Promise<void> {
        const email = req.query.email
        const user = await this.usersService.getByEmail(email)

        const publicUser = sanitizeUser(user!)
        res.status(200).send(publicUser)
    }

    async update(req: Request<UsersParams, unknown, UpdateUserDto>, res: Response<UserDto | {
        message: string
    }>): Promise<void> {
        const id = req.params.id;
        const userData = req.body;

        const updatedUser = await this.usersService.update(id, userData);
        if (!updatedUser) {
            res.status(404).send({message: "User with specified id was not found"})
            return
        }
        const publicUser = sanitizeUser(updatedUser)

        res.status(200).send(publicUser)
    }

    async delete(req: Request<UsersParams>, res: Response<{ message: string }>): Promise<void> {
        const id = req.params.id

        await this.usersService.delete(id)
        res.status(204).send({message: "User was successfully deleted"})
    }
}