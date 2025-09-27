import {Request, RequestHandler} from "express";
import {Doctor, DoctorsParams, UpdateDoctorBody, UpdateDoctorData} from "./types.js";
import {ServiceHelper as UserServiceHelper} from "../users/service.js"
import {ServiceHelper as AuthServiceHelper} from "../auth/service.js"
import fs from "node:fs/promises";
import {paths} from "../shared/paths.js";
import {Role} from "../shared/roles.js";
import {AllInfoUser} from "../users/types.js";
import {ServiceHelper as AppointmentServiceHelper} from "../appointments/service.js"
import {Appointment} from "../appointments/types.js";
import {id} from "../shared/validation/joi-common.js";

export class Service {
    // DONE
    static async getDoctors(req: Request): Promise<AllInfoUser[]> {
        return await UserServiceHelper.getAllInfoUsers(Role.DOCTOR, req.query)
    }

    // DONE
    static async getDoctorById(req: Request): Promise<AllInfoUser> {
        const loggedUser = req.user;
        let user;
        console.log(loggedUser)
        if (loggedUser!.role === Role.DOCTOR) {
            user = await UserServiceHelper.getAllInfoUserById(req.user!.id)
        } else {
            user = await UserServiceHelper.getAllInfoUserById(req.params.id!)
        }

        if (!user) throw new Error("User was not found")
        return user;
    }

    // DONE
    static async updateDoctor(req: Request<{}, unknown, UpdateDoctorBody>): Promise<AllInfoUser> {
        const userId = req.user!.id;
        const {firstName, lastName, specialization, schedule} = req.body;
        const updatedUser = await UserServiceHelper.updateUserData(userId, {firstName, lastName})
        const updatedDoctor = await ServiceHelper.updateDoctorData(userId, {specialization, schedule})

        return {
            profile: updatedUser,
            roleData: updatedDoctor
        };
    }

    // DONE
    static async deleteDoctor(req: Request): Promise<void> {
        const userId = req.user!.id;
        await ServiceHelper.deleteDoctorData(userId)
        await UserServiceHelper.deleteUserData(userId)
        await AuthServiceHelper.deleteAuthItemData(userId)
    }

    static async getAppointments(req: Request): Promise<Appointment[] | undefined> {
        const loggedUser = req.user!;
        return await AppointmentServiceHelper.getAppointmentsData({doctorId: loggedUser.id})
    }
}


export class ServiceHelper {
    static async getDoctorsData(): Promise<Doctor[]> {
        const doctorsData = await fs.readFile(paths.DOCTORS, {encoding: "utf-8"})
        return JSON.parse(doctorsData)
    }

    // DONE
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

    // DONE
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

    // DONE
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
