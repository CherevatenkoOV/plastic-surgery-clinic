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