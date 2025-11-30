import {Request} from "express";
import {
    Doctor,
    DoctorFilter, DoctorsParams,
    DoctorsQuery,
    UpdateDoctorDto,
    UpdateDoctorData
} from "./types.js";
import {ServiceHelper as UserServiceHelper} from "../users/service.js"
import fs from "node:fs/promises";
import {paths} from "../shared/paths.js";
import {Role} from "../shared/roles.js";
import {FullUser, AllInfoUsersQuery} from "../users/types.js";
import {ServiceHelper as AppointmentServiceHelper} from "../appointments/service.js"
import {Appointment} from "../appointments/types.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export class Service {

    // NOTE: refactored
    static async getAll(): Promise<Doctor[]> {
        return await ServiceHelper.getDoctorsData()
    }

    // NOTE: should return Promise<Doctor> after implementation repository pattern
    static async getById(userId: string): Promise<Doctor[]> {
        return await ServiceHelper.getDoctorsData({userId})
    }

    // // NOTE: should be only getting doctors data. all logic of checking roles and combination should be in controller
    // static async get(req: Request): Promise<FullUser[]> {
    //     const id = req.params.id;
    //     const loggedUser = req.user!;
    //
    //     if (!id && (loggedUser.role === Role.ADMIN || loggedUser.role === Role.PATIENT)) {
    //         return await UserServiceHelper.getFullInfo(Role.DOCTOR, undefined, req.query as AllInfoUsersQuery)
    //     }
    //
    //     if (!id && req.url === '/me') {
    //         return await UserServiceHelper.getFullInfo(Role.DOCTOR, {id: loggedUser.id}, req.query as AllInfoUsersQuery)
    //     }
    //
    //     if (id && (loggedUser.role === Role.ADMIN || loggedUser.role === Role.PATIENT)) {
    //         return await UserServiceHelper.getFullInfo(Role.DOCTOR, {id: id}, req.query as AllInfoUsersQuery)
    //     }
    //
    //     throw new Error("Current user doesn't have the access to requested information.")
    // }

    static async update(id: string, doctorData: UpdateDoctorDto): Promise<FullUser> {
        // receive doctorsData
        // update doctorsData



        const [user] = await UserServiceHelper.getBasicInfo({id: userId})
        if (user!.role !== Role.DOCTOR) throw new Error("The specified ID does not belong to the doctor. Please check the ID.")

        const {firstName, lastName, specialization, schedule} = req.body;
        const updatedUser = await UserServiceHelper.updateUserData(userId, {firstName, lastName})
        const updatedDoctor = await ServiceHelper.updateDoctorData(userId, {specialization, schedule})

        return {
            profile: updatedUser,
            roleData: updatedDoctor
        };
    }

    // NOTE: previous version
    // static async updateDoctor(req: Request<DoctorsParams, unknown, UpdateDoctorBody>): Promise<FullUser> {
    //     const userId = req.params.id ?? req.user!.id
    //
    //     const [user] = await UserServiceHelper.getBasicInfo({id: userId})
    //     if (user!.role !== Role.DOCTOR) throw new Error("The specified ID does not belong to the doctor. Please check the ID.")
    //
    //     const {firstName, lastName, specialization, schedule} = req.body;
    //     const updatedUser = await UserServiceHelper.updateUserData(userId, {firstName, lastName})
    //     const updatedDoctor = await ServiceHelper.updateDoctorData(userId, {specialization, schedule})
    //
    //     return {
    //         profile: updatedUser,
    //         roleData: updatedDoctor
    //     };
    // }

    static async deleteDoctor(req: Request): Promise<void> {
        const userId = req.params.id ?? req.user!.id;

        const [user] = await UserServiceHelper.getBasicInfo({id: userId})
        if (user!.role !== Role.DOCTOR) throw new Error("The specified ID does not belong to the doctor. Please check the ID.")

        await ServiceHelper.deleteDoctorData(userId)
        await UserServiceHelper.deleteUserData(userId)
    }

    static async getAppointments(req: Request): Promise<Appointment[] | undefined> {
        const loggedUser = req.user!;
        return await AppointmentServiceHelper.getAppointmentsData({doctorId: loggedUser.id})
    }

    static async sendInviteDoctor(req: Request): Promise<string> {
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


export class ServiceHelper {
    static async getDoctorsData(filter?: DoctorFilter, query?: DoctorsQuery): Promise<Doctor[]> {
        const doctorsData = await fs.readFile(paths.DOCTORS, {encoding: "utf-8"})
        const doctors = JSON.parse(doctorsData)

        if (filter) {
            if ('userId' in filter) return doctors.filter((d: Doctor) => d.userId === filter.userId)
        }

        if (query) {
            let filtered = doctors;

            if ('specialization' in query) {
                filtered = filtered.filter((d: Doctor) => d.specialization === query.specialization)
            }

            return filtered
        }

        return doctors
    }

    static async createDoctorData(doctorData: Doctor): Promise<Doctor> {
        const {userId, specialization, schedule} = doctorData;

        const doctors = await ServiceHelper.getDoctorsData();
        if (doctors.find(d => d.userId === userId)) throw new Error("Doctor with specified userId already exists")

        const newDoctor = {
            userId,
            specialization,
            schedule
        }

        doctors.push(newDoctor)
        await fs.writeFile(
            paths.DOCTORS,
            JSON.stringify(doctors),
            {encoding: 'utf-8'},
        )

        return newDoctor
    }

    static async updateDoctorData(userId: string, doctorData: UpdateDoctorData): Promise<Doctor> {
        const doctors = await ServiceHelper.getDoctorsData();
        const targetDoctor = doctors.find((d) => d.userId === userId)
        let doctor: Doctor;

        if (!targetDoctor) {
            doctor = await ServiceHelper.createDoctorData({
                userId,
                specialization: doctorData.specialization ?? null,
                schedule: doctorData.schedule ?? [],
            })

            return doctor

        } else {
            doctor = {
                userId,
                specialization: doctorData.specialization ?? null,
                schedule: doctorData.schedule ?? [],
            }

            const index = doctors.findIndex((doctor) => doctor.userId === userId);
            doctors[index] = doctor;

            await fs.writeFile(
                paths.DOCTORS,
                JSON.stringify(doctors),
                {encoding: 'utf-8'},
            )

            return doctor;
        }
    }

    static async deleteDoctorData(userId: string): Promise<void> {
        const doctors = await ServiceHelper.getDoctorsData();
        const updatedDoctors = doctors.filter(doctor => doctor.userId !== userId)
        await fs.writeFile(
            paths.DOCTORS,
            JSON.stringify(updatedDoctors),
            {encoding: 'utf-8'},
        )
    }

}
