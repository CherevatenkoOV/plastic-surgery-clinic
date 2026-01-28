import { Request, Response } from "express";
import {
    AuthTokens,
    LoginDto,
    RecoverPasswordDto,
    RecoverPasswordParams,
    RegisterDoctorDto,
    RegisterPatientDto,
    ResetPasswordDto,
    UpdatePasswordDto,
} from "./types.js";
import { AuthFlow } from "./auth-flow.js";

const REFRESH_COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export class AuthController {
    constructor(private readonly authFlow: AuthFlow){}

    registerPatient = async (
        req: Request<{}, unknown, RegisterPatientDto>,
        res: Response<AuthTokens>
    ): Promise<void> => {
        const tokens = await this.authFlow.registerPatient(req.body);

        res.cookie("refreshToken", tokens.refreshToken, {
            secure: true,
            httpOnly: true,
            maxAge: REFRESH_COOKIE_MAX_AGE_MS,
            sameSite: "strict",
        });

        res.status(201).send(tokens);
    };

    async inviteDoctor(req: Request, res: Response): Promise<void> {
        const email = req.body.email;
        if (!email) {
            res.status(400).send({ message: "Missing email" });
            return;
        }

        const previewUrl = await this.authFlow.inviteDoctor(email);

        res.status(200).send({ previewUrl });
    }

    registerDoctor = async (
        req: Request<{ token: string }, unknown, RegisterDoctorDto>,
        res: Response<AuthTokens>
    ): Promise<void> => {
        const inviteToken = req.params.token;
        const tokens = await this.authFlow.registerDoctor(inviteToken, req.body);

        res.cookie("refreshToken", tokens.refreshToken, {
            secure: true,
            httpOnly: true,
            maxAge: REFRESH_COOKIE_MAX_AGE_MS,
            sameSite: "strict",
        });

        res.status(201).send(tokens);
    };

    login = async (
        req: Request<{}, unknown, LoginDto>,
        res: Response<AuthTokens>
    ): Promise<void> => {
        const tokens = await this.authFlow.login(req.body);

        res.cookie("refreshToken", tokens.refreshToken, {
            secure: true,
            httpOnly: true,
            maxAge: REFRESH_COOKIE_MAX_AGE_MS,
            sameSite: "strict",
        });

        res.status(200).send(tokens);
    };


    logout = async (req: Request, res: Response): Promise<void> => {
        const loggedUser = req.user!;
        await this.authFlow.logout(loggedUser.id);

        res.clearCookie("refreshToken", {
            secure: true,
            httpOnly: true,
            sameSite: "strict",
        });

        res.sendStatus(200);
    };

    updatePassword = async (
        req: Request<{}, unknown, UpdatePasswordDto>,
        res: Response<{ message: string }>
    ): Promise<void> => {
        const loggedUser = req.user!;
        await this.authFlow.updatePassword(loggedUser.id, req.body);

        res.clearCookie("refreshToken", {
            secure: true,
            httpOnly: true,
            sameSite: "strict",
        });

        res.status(200).send({ message: "Password was changed successfully" });
    };

    resetPassword = async (
        req: Request<{}, unknown, ResetPasswordDto>,
        res: Response<{ message: string; previewUrl: string | null }>
    ): Promise<void> => {
        const { email } = req.body;

        const previewUrl = await this.authFlow.resetPassword(email.trim().toLowerCase());

        res.status(200).send({
            message: "Link for changing password was sent to email",
            previewUrl,
        });
    };

    recoverPassword = async (
        req: Request<RecoverPasswordParams, unknown, RecoverPasswordDto>,
        res: Response<{ message: string }>
    ): Promise<void> => {
        const resetToken = req.params.resetToken;

        await this.authFlow.recoverPassword(resetToken, req.body);

        res.clearCookie("refreshToken", {
            secure: true,
            httpOnly: true,
            sameSite: "strict",
        });

        res.status(200).send({ message: "New password was set successfully" });
    };
}

