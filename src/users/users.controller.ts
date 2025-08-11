import {Request, Response} from "express";
import {
    UsersParams,
    CreateUserBody,
    User,
    UpdateUserBody, UserPublic, Credentials
} from "./types.js";
import {Service} from "./service.js";


export const getAll = async (req: Request, res: Response<UserPublic[]>): Promise<void> => {
    const users = await Service.getUsers();
    res.status(200).send(users)
}

export const getById = async (req: Request<UsersParams>, res: Response<UserPublic | undefined>): Promise<void> => {
    const user = await Service.getUserById(req)
    res.status(200).send(user)
}

export const create = async (req: Request<{}, unknown, CreateUserBody>, res: Response<UserPublic>): Promise<void> => {
    const newUser = await Service.createUser(req);
    res.status(201).send(newUser)
}

export const login = async (req: Request<{}, unknown, Credentials>, res: Response<{ message: string }>): Promise<void> => {

}

export const update = async (req: Request<UsersParams, unknown, UpdateUserBody>, res: Response<UserPublic>): Promise<void> => {
    const updatedUser = await Service.updateUser(req);
    res.status(200).send(updatedUser)
}

export const remove = async (req: Request<UsersParams>, res: Response<void>): Promise<void> => {
    await Service.deleteUser(req)
    res.status(204).send()
}

