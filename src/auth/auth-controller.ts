import {Request, Response} from "express";
import {
    AuthTokens,
    UpdatePasswordDto,
    ResetPasswordDto, FullRegisterInfo, RecoverPasswordParams, RecoverPasswordDto
} from "./types.js";
import {CreateCredentialsDto} from "../users/types.js";
import {AuthService} from "./service.js";

export class AuthController {
    constructor(private readonly authService: AuthService){}

    async register (req: Request<{}, unknown, FullRegisterInfo>, res: Response<{
        message: string
    }>): Promise<void> {
        const registerData = req.body

        const tokens = await this.authService.register(registerData);

        // TODO: check this code in PostMan. Probably redundant
        if (!tokens) {
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

    registerByToken = async (req: Request<{ token: string }, unknown, FullRegisterInfo>, res: Response<{
        message: string
    }>): Promise<void> => {
        const token = req.params.token;
        const registerInfo = req.body

        const tokens = await this.authService.registerByToken(token, registerInfo);

        res.cookie('refreshToken', tokens.refreshToken, {
            secure: true,
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        res.status(201).send({message: "New user was registered successfully with using invite token"})
    }

    login = async (req: Request<{}, unknown, CreateCredentialsDto>, res: Response<AuthTokens>): Promise<void> => {
        const credentials = req.body

        const tokens = await this.authService.login(credentials)

        res.status(201).send(tokens)
    }

    logout = async (req: Request, res: Response): Promise<void> => {
        const loggedUser = req.user!

        await this.authService.logout(loggedUser.id);

        res.sendStatus(200)
    }

    updatePassword = async (req: Request<{}, unknown, UpdatePasswordDto>, res: Response<{
        message: string
    }>): Promise<void> => {
        const newPasswordData = req.body

        await this.authService.updatePassword(newPasswordData)

        res.status(200).send({message: "Password was changed successfully"})
    }

    resetPassword = async (req: Request<{}, unknown, ResetPasswordDto>, res: Response<{
        message: string
    }>): Promise<void> => {
        const requestResetData = req.body

        await this.authService.resetPassword(requestResetData)

        res.status(200).send({message: "Link for changing password was sent to email"})
    }

    recoverPassword = async (req: Request<RecoverPasswordParams, unknown, RecoverPasswordDto>, res: Response<{
        message: string
    }>): Promise<void> => {
        const resetToken = req.params.resetToken;
        const newPasswordData = req.body

        await this.authService.recoverPassword(resetToken, newPasswordData)

        res.status(200).send({message: "New password was set successfully"})
    }
}
