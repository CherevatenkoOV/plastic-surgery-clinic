import {Request} from "express";
import fs from "node:fs/promises";
import {paths} from "../shared/paths.js";
import {Patient, PatientFilter, PatientsParams, UpdatePatientBody, UpdatePatientData} from "./types.js";
import {ServiceHelper as UserServiceHelper} from "../users/service.js";
import {Role} from "../shared/roles.js";
import {FullUserDto, AllInfoUsersQuery, User} from "../users/types.js";
import {Appointment} from "../appointments/types.js";
import {ServiceHelper as AppointmentServiceHelper} from "../appointments/service.js";
import {Doctor} from "../doctors/types.js";

export class Service {
    static async get(req: Request): Promise<FullUserDto[]> {
        const id = req.params.id
        const loggedUser = req.user!;

        if (!id && (loggedUser.role === Role.ADMIN || loggedUser.role === Role.DOCTOR)) {
            return await UserServiceHelper.getFullInfo(Role.PATIENT, undefined, req.query as AllInfoUsersQuery)
        }

        if (!id && req.url === '/me') {
            return await UserServiceHelper.getFullInfo(Role.PATIENT, {id: loggedUser.id}, req.query as AllInfoUsersQuery)
        }

        if (id && (loggedUser.role === Role.ADMIN || loggedUser.role === Role.DOCTOR)) {
            return await UserServiceHelper.getFullInfo(Role.PATIENT, {id: id}, req.query as AllInfoUsersQuery)
        }

        throw new Error("Current user doesn't have the access to requested information.")
    }

    static async updatePatient(req: Request<PatientsParams, unknown, UpdatePatientBody>): Promise<FullUserDto> {
        const userId = req.params.id ?? req.user!.id;

        const [user]  = await UserServiceHelper.getBasicInfo({id: userId})
        if (user!.role !== Role.PATIENT) throw new Error("The specified ID does not belong to the patient. Please check the ID.")

        const {firstName, lastName, phone} = req.body;

        const updatedUser = await UserServiceHelper.updateUserData(userId, {firstName, lastName})
        const updatedPatient = await ServiceHelper.updatePatientData(userId, {phone})

        return {
            profile: updatedUser,
            roleData: updatedPatient
        };
    }

    static async deletePatient(req: Request): Promise<void> {
        const userId = req.params.id ?? req.user!.id;

        const [user]  = await UserServiceHelper.getBasicInfo({id: userId})
        if (user!.role !== Role.PATIENT) throw new Error("The specified ID does not belong to the patient. Please check the ID.")

        await ServiceHelper.deletePatientData(userId)
        await UserServiceHelper.deleteUserData(userId)
    }

    static async getAppointments(req: Request): Promise<Appointment[] | undefined> {
        const loggedUser = req.user!;
        return await AppointmentServiceHelper.getAppointmentsData({patientId: loggedUser.id})
    }

}

export class ServiceHelper {
    static async getPatientsData(filter?: PatientFilter): Promise<Patient[]> {
        const patientsData = await fs.readFile(paths.PATIENTS, {encoding: "utf-8"})
        const patients = JSON.parse(patientsData)

        if (filter) {
            if ('userId' in filter) return patients.filter((d: Doctor) => d.userId === filter.userId)
        }

        return patients
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