import {Request, Response} from "express";
import {Service} from "./service.js";
import {
    AuthTokens,
    ChangePasswordBody,
    ResetPasswordBody,
    Credentials, FullRegisterInfo, RecoverPasswordParams, RecoverPasswordBody
} from "./types.js";

export const register = async (req: Request<{}, unknown, FullRegisterInfo>, res: Response<{message: string}>): Promise<void> => {
    const tokens = await Service.register(req);

    if(tokens == null) {res.status(201).send({message: "Your request for registration was created. Wait for email."})
    } else {
        res.cookie('refreshToken', tokens.refreshToken, {
            secure: true,
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
        res.status(201).send({message: "New user was registered successfully"})
    }
}

export const registerByToken = async (req: Request<{token: string}, unknown, FullRegisterInfo>, res: Response<{message: string}>): Promise<void> => {
    const tokens = await Service.registerByToken(req);
    res.cookie('refreshToken', tokens.refreshToken, {
        secure: true,
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
    res.status(201).send({message: "New user was registered successfully with using invite token"})
}

export const login = async (req: Request<{}, unknown, Credentials>, res: Response<AuthTokens>): Promise<void> => {
    const tokens = await Service.login(req)
    res.status(201).send(tokens)
}

export const logout = async (req: Request, res: Response): Promise<void> => {
    await Service.logout(req);
    res.sendStatus(200)
}

export const updatePassword = async (req: Request<{}, unknown, ChangePasswordBody>, res: Response<{
    message: string
}>): Promise<void> => {
    await Service.updatePassword(req)
    res.status(200).send({message: "Password was changed successfully"})
}

export const resetPassword = async (req: Request<{}, unknown, ResetPasswordBody>, res: Response<{
    message: string
}>): Promise<void> => {
    await Service.resetPassword(req)
    res.status(200).send({message: "Link for changing password was sent to email"})
}

export const recoverPassword = async (req: Request<RecoverPasswordParams, unknown, RecoverPasswordBody>, res: Response<{
    message: string
}>): Promise<void> => {
    await Service.recoverPassword(req)
    res.status(200).send({message: "New password was set successfully"})

}
