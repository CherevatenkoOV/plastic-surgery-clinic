import {Request, Response} from "express";
import {
    UsersParams,
    User, UpdateUserBody, CreateUserData
} from "./types.js";
import {Service} from "./service.js";
import {removeSensitiveData} from "./helpers/remove-sensitive-data.js";

export const getAll = async (req: Request, res: Response<User[]>): Promise<void> => {
    const users = await Service.get();
    const publicUsers = await removeSensitiveData(users)
    res.status(200).send(publicUsers)
}

export const getById = async (req: Request<UsersParams>, res: Response<User[]>): Promise<void> => {
    const user = await Service.get(req)
    const publicUser = await removeSensitiveData(user)
    res.status(200).send(publicUser)
}

// TODO: Create service
// export const create = async (req: Request<{}, unknown, CreateUserData>, res: Response<User>): Promise<void> => {
//     const newUser = await Service.create(req);
//     res.status(201).send(newUser)
// }


export const update = async (req: Request<UsersParams, unknown, UpdateUserBody>, res: Response<User>): Promise<void> => {
    const updatedUser = await Service.update(req);
    const publicUser = await removeSensitiveData(updatedUser)
    res.status(200).send(publicUser)
}

export const remove = async (req: Request<UsersParams>, res: Response<void>): Promise<void> => {
    await Service.remove(req)
    res.status(204).send()
}