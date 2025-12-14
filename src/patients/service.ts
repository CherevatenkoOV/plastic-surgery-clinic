import {Request} from "express";
import fs from "node:fs/promises";
import {paths} from "../shared/paths.js";
import {
    FullPatientDto,
    FullPatientFilter,
    Patient, UpdatePatientData,
    UpdatePatientDto
} from "./types.js";
import {Service as UserService} from "../users/service.js"
import {Appointment} from "../appointments/types.js";
import {ServiceHelper as AppointmentServiceHelper} from "../appointments/service.js";
import {mergeUsersWithRoles} from "../shared/helpers/merge-users-with-roles.js";
import {mergeUserWithRole} from "../shared/helpers/merge-user-with-role.js";

// NOTE: done
export class Service {
    static async get(filter?: FullPatientFilter): Promise<FullPatientDto[]> {
        const {firstName, lastName} = filter ?? {}

        const patients = await ServiceHelper.getPatientsData()
        const users = await UserService.get({firstName, lastName})

        return mergeUsersWithRoles(users, patients)

    }

    // NOTE: done
    static async getById(userId: string): Promise<FullPatientDto | undefined> {
        const doctor = await ServiceHelper.getPatientDataById(userId)
        const user = await UserService.getById(userId)
        return mergeUserWithRole(user, doctor)
    }

    // NOTE: done
    static async update(id: string, patientData: UpdatePatientDto): Promise<FullPatientDto> {
        const {firstName, lastName, phone} = patientData
        const updatedUser = await UserService.update(id, {firstName, lastName})
        const updatedPatient = await ServiceHelper.updatePatientData(id, {phone})

        return mergeUserWithRole(updatedUser, updatedPatient)
    }

    // NOTE: done
    static async delete(id: string): Promise<void> {
        await ServiceHelper.deletePatientData(id)
        await UserService.remove(id)
    }


    static async getAppointments(req: Request): Promise<Appointment[] | undefined> {
        const loggedUser = req.user!;
        return await AppointmentServiceHelper.getAppointmentsData({patientId: loggedUser.id})
    }

}

export class ServiceHelper {
    // NOTE: done
    static async getPatientsData(): Promise<Patient[]> {
        const patientsData = await fs.readFile(paths.PATIENTS, {encoding: "utf-8"})
        return JSON.parse(patientsData)
    }

    // NOTE: done
    static async getPatientDataById(id: string): Promise<Patient | undefined> {
        const patients = await this.getPatientsData()
        const targetPatient = patients.find(p => p.userId === id)
        if(!targetPatient) throw new Error("The specified patient was not found")

        return targetPatient
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