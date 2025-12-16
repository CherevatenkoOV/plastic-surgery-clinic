import {Request} from "express";
import {FullDoctorDto, FullDoctorFilter, UpdateDoctorDto} from "./types.js";
import {ServiceHelper as AppointmentServiceHelper} from "../appointments/service.js"
import {Appointment} from "../appointments/types.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import {mergeUsersWithRoles} from "../shared/helpers/merge-users-with-roles.js";
import {mergeUserWithRole} from "../shared/helpers/merge-user-with-role.js";
import {IDoctorsRepository} from "./repository/i-doctors-repository.js";
import {UsersService} from "../users/service.js";

export class DoctorsService {
    constructor(
        private readonly doctorsRepo: IDoctorsRepository,
        private readonly usersService: UsersService
    ){}

      async get(filter?: FullDoctorFilter): Promise<FullDoctorDto[]> {
        const {specialization, firstName, lastName} = filter ?? {}

        const doctors = await this.doctorsRepo.find({specialization})
        const users = await this.usersService.get({firstName, lastName})
        return mergeUsersWithRoles(users, doctors)
    }

      async getById(userId: string): Promise<FullDoctorDto | undefined> {
        const doctor = await this.doctorsRepo.findById(userId)
        const user = await this.usersService.getById(userId)
        return mergeUserWithRole(user, doctor)
    }

      async update(id: string, doctorData: UpdateDoctorDto): Promise<FullDoctorDto> {
        const {firstName, lastName, specialization, schedule} = doctorData
        const updatedUser = await this.usersService.update(id, {firstName, lastName})
        const updatedDoctor = await this.doctorsRepo.update(id, {specialization, schedule})

        return mergeUserWithRole(updatedUser, updatedDoctor)
    }

      async delete(id: string): Promise<void> {
        await this.doctorsRepo.delete(id)
        await this.usersService.remove(id)
    }

      async getAppointments(req: Request): Promise<Appointment[] | undefined> {
        const loggedUser = req.user!;
        return await AppointmentServiceHelper.getAppointmentsData({doctorId: loggedUser.id})
    }

     async sendInviteDoctor(req: Request): Promise<string> {
        const email = req.body.email;

        const secret: string = process.env.RESET_PASSWORD_JWT as string

        const token = jwt.sign({email}, secret, {expiresIn: '15m'})
        const registrationLink = `${process.env.API_URL}:${process.env.PORT}/auth/register/doctor/${token}`

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: `${process.env.MAIL_USER}`,
                pass: `${process.env.MAIL_PASS}`
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            to: email,
            from: process.env.MAIL_USER,
            subject: 'Invite Link',
            text: `You are receiving this email because you have been invited to join our medical platform as a doctor.
            Please click on the following link, or paste it into your browser, to complete your registration and set up your account:\n\n
          ${registrationLink}\n\n
          If you did not request this registration, please contact our support team at: +33 333 333 33 33.\n`,
        }

        console.log(mailOptions)

        // for tests:
        // make definition of info asynchronous (add await)
        const info = await transporter.sendMail(mailOptions)


        // for tests:
        // uncomment the line below
        console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

        return token
    }
}
