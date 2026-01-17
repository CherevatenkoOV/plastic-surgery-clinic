import nodemailer from "nodemailer";

interface MailSendResult {
    messageId: string,
    previewUrl?: string | null
}

export class MailService {
    private readonly transporter: nodemailer.Transporter

    constructor(
        private readonly user: string,
        private readonly pass: string,
        private  readonly apiUrl: string,
        transporter?: nodemailer.Transporter
    ) {
        this.transporter =
            transporter ??
            nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {user: this.user, pass: this.pass}
            })
    }

    async sendResetPasswordLink(params: {
        token: string;
        toEmail: string;
    }): Promise<MailSendResult> {
        const {token, toEmail} = params;

        const resetURL = `${this.apiUrl}/auth/recover/${token}`;

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


        // TODO should be changed to lo
        return {
            messageId: info.messageId,
            previewUrl,
        };
    }
}