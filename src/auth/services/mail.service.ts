import nodemailer from "nodemailer";
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

/*
For testing you can create test-account on https://ethereal.email/create
Than you should put user and pass in .env
 */

interface MailSendResult {
    messageId: string,
    previewUrl?: string | null
}

@Injectable()
export class MailService {
    private readonly transporter: nodemailer.Transporter
    private user: string;
    private apiUrl: string;
    private host: string;
    private port: string;


    constructor(
        private configService: ConfigService,
    ) {
        this.user = this.configService.getOrThrow("MAIL_USER")
        const pass = this.configService.getOrThrow("MAIL_PASSWORD")
        this.host = this.configService.getOrThrow("MAIL_HOST")
        this.port = this.configService.getOrThrow("MAIL_PORT")
        this.apiUrl = this.configService.getOrThrow("API_URL")


        this.transporter = nodemailer.createTransport({
                host: this.host,
                port: this.port,
                secure: false,
                auth: {
                    user: this.user,
                    pass: pass
                }

            })
    }

    async sendResetPasswordLink(params: {
        token: string;
        toEmail: string;
    }): Promise<MailSendResult> {
        const {token, toEmail} = params;

        const resetURL = `${this.apiUrl}/auth/password/recover/${token}`;

        const info = await this.transporter.sendMail({
            to: toEmail,
            from: this.user,
            subject: "Password Reset Request",
            text:
                `You are receiving this because you (or someone else) have requested the reset of the password for your account.

                  Please click on the following link, or paste this into your browser to complete the process:
                  ${resetURL}

                  If you did not request this, please ignore this email and your password will remain unchanged.
                `,
        });

        const rawPreview = nodemailer.getTestMessageUrl(info);
        const previewUrl = rawPreview ? rawPreview : null;


        return {
            messageId: info.messageId,
            previewUrl,
        };
    }

    async sendDoctorInviteLink(params: { token: string; toEmail: string }): Promise<MailSendResult> {
        const { token, toEmail } = params;

        // тут важно: твой registerDoctor ожидает token из URL
        const inviteUrl = `${this.apiUrl}/auth/register/doctor/${token}`;

        const info = await this.transporter.sendMail({
            to: toEmail,
            from: this.user,
            subject: "Doctor invitation",
            text:
                `You are receiving this email because you have been invited to join our medical platform as a doctor.\n\n` +
                `Please click on the following link, or paste it into your browser, to complete your registration:\n` +
                `${inviteUrl}\n\n` +
                `If you did not request this registration, you can ignore this email.\n`,
        });

        const rawPreview = nodemailer.getTestMessageUrl(info);
        const previewUrl = rawPreview ? rawPreview : null;

        return { messageId: info.messageId, previewUrl };
    }
}