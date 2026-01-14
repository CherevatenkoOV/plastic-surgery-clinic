import {Request} from "express";
import {CreateDoctorDto, Doctor, FullDoctorDto, FullDoctorFilter, UpdateDoctorDto} from "./types.js";
import {Appointment} from "../appointments/types.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import {mergeUsersWithRoles} from "../shared/helpers/merge-users-with-roles.js";
import {mergeUserWithRole} from "../shared/helpers/merge-user-with-role.js";
import {IDoctorsRepository} from "./repository/i-doctors-repository.js";
import {IUsersRepository} from "../users/repository/i-users-repository.js";
import {IAppointmentsRepository} from "../appointments/repository/i-appointments-repository.js";

export class DoctorsService {
    constructor(
        private readonly doctorsRepo: IDoctorsRepository,
        private readonly usersRepo: IUsersRepository,
        private readonly appointmentsRepo: IAppointmentsRepository
    ) {
    }

    async create(doctorData: CreateDoctorDto): Promise<Doctor> {

        return await this.doctorsRepo.create(doctorData)
    }

    async get(filter?: FullDoctorFilter): Promise<FullDoctorDto[]> {
        const {specialization, firstName, lastName} = filter ?? {}

        const doctors = await this.doctorsRepo.find({specialization})
        const users = await this.usersRepo.find({firstName, lastName})
        return mergeUsersWithRoles(users, doctors)
    }

    async getById(userId: string): Promise<FullDoctorDto | undefined> {
        const doctor = await this.doctorsRepo.findById(userId)
        const user = await this.usersRepo.findById(userId)
        return mergeUserWithRole(user, doctor)
    }

    async update(id: string, doctorData: UpdateDoctorDto): Promise<FullDoctorDto> {
        const {firstName, lastName, specialization, schedule} = doctorData
        const updatedUser = await this.usersRepo.updateProfile(id, {firstName, lastName})
        const updatedDoctor = await this.doctorsRepo.update(id, {specialization, schedule})

        return mergeUserWithRole(updatedUser, updatedDoctor)
    }

    async delete(id: string): Promise<void> {
        await this.doctorsRepo.delete(id)
        await this.usersRepo.delete(id)
    }

    async getAppointments(req: Request): Promise<Appointment[] | undefined> {
        const loggedUser = req.user!;

        return await this.appointmentsRepo.find({doctorId: loggedUser.id})
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
