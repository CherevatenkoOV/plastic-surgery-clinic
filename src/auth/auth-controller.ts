import {Request, Response} from "express";
import {
    UserPublic
} from "../users/types.js";
import {Service} from "./service.js";
import {
    AuthTokens,
    ChangePasswordBody, AuthRegisterBody,
    RequestResetPasswordBody,
    ResetPasswordBody,
    ResetPasswordQuery, Credentials
} from "./types.js";

export const register = async (req: Request<{}, unknown, AuthRegisterBody>, res: Response<UserPublic>): Promise<void> => {
    const newUser = await Service.register(req);
    res.cookie('refreshToken', newUser.tokens.refreshToken, {
        secure: true,
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
    res.status(201).send(newUser.userData)
}

export const login = async (req: Request<{}, unknown, Credentials>, res: Response<AuthTokens>): Promise<void> => {
    const tokens = await Service.login(req)
    res.status(201).send(tokens)
}

export const logout = async (req: Request, res: Response): Promise<void> => {
    await Service.logout(req);
    res.sendStatus(200)
}

export const changePassword = async (req: Request<{}, unknown, ChangePasswordBody>, res: Response<{
    message: string
}>): Promise<void> => {
    await Service.changePassword(req)
    res.status(200).send({message: "Password was changed successfully"})
}

export const requestResetPassword = async (req: Request<{}, unknown, RequestResetPasswordBody>, res: Response<{
    message: string
}>): Promise<void> => {
    await Service.requestResetPassword(req)
    res.status(200).send({message: "Link for changing password was sent to email"})
}

export const resetPassword = async (req: Request<{}, unknown, ResetPasswordBody, ResetPasswordQuery>, res: Response<{
    message: string
}>): Promise<void> => {
    await Service.resetPassword(req)
    res.status(200).send({message: "Password was changed successfully"})
}