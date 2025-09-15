import {Request, Response} from "express";
import {
    UsersParams,
    UpdateUserBody,
    UserPublic
} from "./types.js";
import {Service} from "./service.js";


export const getAll = async (req: Request, res: Response<UserPublic[]>): Promise<void> => {
    const users = await Service.getAll();
    console.log(users)
    res.status(200).send(users)
}

export const getById = async (req: Request<UsersParams>, res: Response<UserPublic | undefined>): Promise<void> => {
    const user = await Service.getById(req)
    res.status(200).send(user)
}

export const update = async (req: Request<UsersParams, unknown, UpdateUserBody>, res: Response<UserPublic>): Promise<void> => {
    const updatedUser = await Service.update(req);
    res.status(200).send(updatedUser)
}

export const remove = async (req: Request<UsersParams>, res: Response<void>): Promise<void> => {
    await Service.remove(req)
    res.status(204).send()
}