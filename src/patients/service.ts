import {Request} from "express";
import fs from "node:fs/promises";
import {paths} from "../shared/paths.js";
import {CreatePatientBody, Patient, PatientsParams, PatientsQuery, UpdatePatientBody} from "./types.js";
import {randomUUID} from "node:crypto";

export class Service {
    static async getPatients(req: Request<{}, unknown, unknown, PatientsQuery>): Promise<Patient[]> {
        return await ServiceHelper.getPatientsData(req.query);
    }

    static async getPatientById(req: Request<{ id: string }>): Promise<Patient | undefined> {
        return await ServiceHelper.getPatientDataById(req.params.id)
    }

    static async createPatient(req: Request<{}, unknown, CreatePatientBody>): Promise<Patient> {
        const patients = await ServiceHelper.getPatientsData();

        const existingPatient = patients.find((patient: Patient) => (
            patient.firstName === req.body.firstName
            && patient.lastName === req.body.lastName
            || patient.phone === req.body.phone
        ))

        if (existingPatient) {
            return existingPatient;
        } else {
            const id = randomUUID();
            const now = new Date().toISOString();
            const createdAt = now;
            const updatedAt = now;

            const newPatient = {
                id,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
                createdAt,
                updatedAt
            }

            const existingPatient = patients.find((patient: Patient) => patient.id === id)
            if (existingPatient) return existingPatient;

            patients.push(newPatient);

            await fs.writeFile(
                paths.PATIENTS,
                JSON.stringify(patients),
                {encoding: 'utf-8'},
            )
            return newPatient;
        }
    }

    static async updatePatient(req: Request<PatientsParams, unknown, UpdatePatientBody>): Promise<Patient> {
        const id = req.params.id;
        const patients = await ServiceHelper.getPatientsData();
        const targetPatient = patients.find((patient: Patient) => patient.id === id)

        const existingPatient = patients.find((patient: Patient) => (
            patient.firstName === req.body.firstName
            && patient.lastName === req.body.lastName
            || patient.phone === req.body.phone
        ))

        if (!targetPatient) throw new Error("Specified patient is not found")
        if (existingPatient) throw new Error("Patient with specified first name and last name or phone already exist")

        const updatedPatient: Patient = {
            id: targetPatient.id,
            firstName: req.body.firstName ?? targetPatient.firstName,
            lastName: req.body.lastName ?? targetPatient.lastName,
            phone: req.body.phone ?? targetPatient.phone,
            createdAt: targetPatient.createdAt,
            updatedAt: new Date().toISOString()
        }


        const index = patients.findIndex((patient: Patient) => patient.id === targetPatient.id);
        patients[index] = updatedPatient;

        await fs.writeFile(
            paths.PATIENTS,
            JSON.stringify(patients),
            {encoding: 'utf-8'},
        )

        return updatedPatient;
    }

    static async deletePatient(req: Request<PatientsParams>): Promise<Patient[]> {
        const patients = await ServiceHelper.getPatientsData();
        const updatedPatients = patients.filter(patient => patient.id !== req.params.id)

        await fs.writeFile(
            paths.PATIENTS,
            JSON.stringify(updatedPatients),
            {encoding: 'utf-8'},
        )

        return updatedPatients
    }

}

class ServiceHelper {
    static async getPatientsData(query?: PatientsQuery): Promise<Patient[]> {

        try {
            const data = await fs.readFile(paths.PATIENTS, {encoding: "utf-8"})
            const patients = JSON.parse(data)
            if (!query) return patients;

            const {firstName, lastName} = query;

            if (firstName) {
                return patients.filter((patient: Patient) => patient.firstName === firstName)
            } else if (lastName) {
                return patients.filter((patient: Patient) => patient.lastName === lastName)
            } else {
                return patients;
            }

        } catch (err) {
            throw new Error(`Something went wrong while reading patients.json. Err: ${err}`)
        }
    }

    static async getPatientDataById(id: string, patients?: Patient[]): Promise<Patient | undefined> {
        const data = patients ?? await ServiceHelper.getPatientsData();
        return data.find((patient: Patient) => patient.id === id)
    }
}