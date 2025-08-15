import {Request, Response} from "express";
import {
    UsersParams,
    CreateUserBody,
    UpdateUserBody, UserPublic, UserCredentials, AuthTokens, ChangePasswordBody
} from "./types.js";
import {Service} from "./service.js";


export const getAll = async (req: Request, res: Response<UserPublic[]>): Promise<void> => {
    const users = await Service.getAll();
    res.status(200).send(users)
}

export const getById = async (req: Request<UsersParams>, res: Response<UserPublic | undefined>): Promise<void> => {
    const user = await Service.getById(req)
    res.status(200).send(user)
}

export const register = async (req: Request<{}, unknown, CreateUserBody>, res: Response<UserPublic>): Promise<void> => {
    const newUser = await Service.register(req);
    res.cookie('refreshToken', newUser.tokens.refreshToken, {
        secure: true,
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
    res.status(201).send(newUser.userData)
}

export const login = async (req: Request<{}, unknown, UserCredentials>, res: Response<AuthTokens>): Promise<void> => {
    const tokens = await Service.login(req)

    res.status(201).send(tokens)
}

export const changePassword = async (req: Request<{}, unknown, ChangePasswordBody>, res: Response<{ message: string }>): Promise<void> => {
    await Service.changePassword(req)

    res.status(200).send({message: "Password was changed successfully"})
}

export const update = async (req: Request<UsersParams, unknown, UpdateUserBody>, res: Response<UserPublic>): Promise<void> => {
    const updatedUser = await Service.update(req);
    res.status(200).send(updatedUser)
}

export const remove = async (req: Request<UsersParams>, res: Response<void>): Promise<void> => {
    await Service.remove(req)
    res.status(204).send()
}