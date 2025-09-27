import {Request} from "express";
import fs from "node:fs/promises";
import {paths} from "../shared/paths.js";
import {Patient, PatientsParams, UpdatePatientBody, UpdatePatientData} from "./types.js";
import {ServiceHelper as UserServiceHelper} from "../users/service.js";
import {ServiceHelper as AuthServiceHelper} from "../auth/service.js"
import {Role} from "../shared/roles.js";
import {AllInfoUser, AllInfoUsersQuery, User} from "../users/types.js";
import {Appointment} from "../appointments/types.js";
import {ServiceHelper as AppointmentServiceHelper} from "../appointments/service.js";

export class Service {

    // DONE
    static async getPatients(req: Request): Promise<AllInfoUser[]> {
        return await UserServiceHelper.getAllInfoUsers(Role.PATIENT, req.query)
    }

    // DONE
    static async getPatientById(req: Request): Promise<AllInfoUser> {
        const loggedUser = req.user;
        let user;

        if(loggedUser!.role === Role.PATIENT) {
            user = await UserServiceHelper.getAllInfoUserById(req.user!.id)
        } else {
            user = await UserServiceHelper.getAllInfoUserById(req.params.id!)
        }

        if (!user) throw new Error("User (patient) was not found")
        return user;
    }

    // DONE
    static async updatePatient(req: Request<{}, unknown, UpdatePatientBody>): Promise<AllInfoUser> {
        const userId = req.user!.id;
        const {firstName, lastName, phone} = req.body;

        const updatedUser = await UserServiceHelper.updateUserData(userId, {firstName, lastName})
        const updatedPatient = await ServiceHelper.updatePatientData(userId, {phone})

        return {
            profile: updatedUser,
            roleData: updatedPatient
        };
    }

    // DONE
    static async deletePatient(req: Request): Promise<void> {
        const userId = req.user!.id;
        await ServiceHelper.deletePatientData(userId)
        await UserServiceHelper.deleteUserData(userId)
        await AuthServiceHelper.deleteAuthItemData(userId)
    }

    static async getAppointments(req: Request): Promise<Appointment[] | undefined> {
        const loggedUser = req.user!;
        return await AppointmentServiceHelper.getAppointmentsData({patientId: loggedUser.id})
    }

}

export class ServiceHelper {
    //DONE
    static async getPatientsData(): Promise<Patient[]> {
        const patientsData = await fs.readFile(paths.PATIENTS, {encoding: "utf-8"})
        return JSON.parse(patientsData)
    }

    static async createPatientData(patientData: Patient): Promise<Patient> {
        const {userId, phone} = patientData;

        const patients = await ServiceHelper.getPatientsData();
        if (patients.find(p => p.userId === userId)) throw new Error("Patient with specified userId already exists")

        const newPatient = {
            userId,
            phone: phone ?? null
        }

        patients.push(newPatient)
        await fs.writeFile(
            paths.PATIENTS,
            JSON.stringify(patients),
            {encoding: 'utf-8'},
        )

        return newPatient
    }



    // DONE
    static async updatePatientData(userId: string, patientData: UpdatePatientData): Promise<Patient> {
        const patients = await ServiceHelper.getPatientsData();
        const targetPatient = patients.find((p: Patient) => p.userId === userId)
        let patient: Patient;

        if (!targetPatient) {
            patient = await ServiceHelper.createPatientData({
                userId,
                phone: patientData.phone ?? null
            })

            return patient

        } else {
            patient = {
                userId,
                phone: patientData.phone ?? targetPatient.phone,
            }

            const index = patients.findIndex((patient: Patient) => patient.userId === userId);
            patients[index] = patient;

            await fs.writeFile(
                paths.PATIENTS,
                JSON.stringify(patients),
                {encoding: 'utf-8'},
            )

            return patient;
        }


    }
    // DONE
    static async deletePatientData(userId: string): Promise<void> {
        const patients = await ServiceHelper.getPatientsData();
        const updatedPatients = patients.filter(patient => patient.userId !== userId)

        await fs.writeFile(
            paths.PATIENTS,
            JSON.stringify(updatedPatients),
            {encoding: 'utf-8'},
        )
    }
}