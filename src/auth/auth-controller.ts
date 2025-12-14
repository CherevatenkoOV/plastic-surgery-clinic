import {Request, Response} from "express";
import {Service} from "./service.js";
import {
    AuthTokens,
    UpdatePasswordDto,
    ResetPasswordDto, FullRegisterInfo, RecoverPasswordParams, RecoverPasswordDto
} from "./types.js";
import {CreateCredentialsDto} from "../users/types.js";

export const register = async (req: Request<{}, unknown, FullRegisterInfo>, res: Response<{message: string}>): Promise<void> => {
    const registerData = req.body

    const tokens = await Service.register(registerData);

    // TODO: check this code in PostMan. Probably redundant
    if(!tokens) {
        res.status(201).send({message: "A problem occurred while generating tokens"})
        return
    }

        res.cookie('refreshToken', tokens!.refreshToken, {
            secure: true,
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        res.status(201).send({message: "New user was registered successfully"})
}

export const registerByToken = async (req: Request<{token: string}, unknown, FullRegisterInfo>, res: Response<{message: string}>): Promise<void> => {
    const token = req.params.token;
    const registerInfo = req.body

    const tokens = await Service.registerByToken(token, registerInfo);

    res.cookie('refreshToken', tokens.refreshToken, {
        secure: true,
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
    })

    res.status(201).send({message: "New user was registered successfully with using invite token"})
}

export const login = async (req: Request<{}, unknown, CreateCredentialsDto>, res: Response<AuthTokens>): Promise<void> => {
    const credentials = req.body

    const tokens = await Service.login(credentials)

    res.status(201).send(tokens)
}

export const logout = async (req: Request, res: Response): Promise<void> => {
    const loggedUser = req.user!

    await Service.logout(loggedUser.id);

    res.sendStatus(200)
}

export const updatePassword = async (req: Request<{}, unknown, UpdatePasswordDto>, res: Response<{
    message: string
}>): Promise<void> => {
    const newPasswordData = req.body

    await Service.updatePassword(newPasswordData)

    res.status(200).send({message: "Password was changed successfully"})
}


export const resetPassword = async (req: Request<{}, unknown, ResetPasswordDto>, res: Response<{
    message: string
}>): Promise<void> => {
    const requestResetData = req.body

    await Service.resetPassword(requestResetData)

    res.status(200).send({message: "Link for changing password was sent to email"})
}

export const recoverPassword = async (req: Request<RecoverPasswordParams, unknown, RecoverPasswordDto>, res: Response<{
    message: string
}>): Promise<void> => {
    const resetToken = req.params.resetToken;
    const newPasswordData = req.body

    await Service.recoverPassword(resetToken, newPasswordData)

    res.status(200).send({message: "New password was set successfully"})
}
