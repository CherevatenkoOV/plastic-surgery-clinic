import {Request} from "express";
import {CreateDoctorBody, UpdateDoctorBody, Doctor, DoctorsParams, DoctorsQuery} from "./types.js";
import fs from "node:fs/promises";
import {paths} from "../shared/paths.js";
import {randomUUID} from "node:crypto";

export class Service {
    static async getDoctors(req: Request<DoctorsParams, unknown, unknown, DoctorsQuery>): Promise<Doctor[]> {
        return await ServiceHelper.getDoctorsData(req.query);
    }

    static async getDoctorById(req: Request<DoctorsParams>): Promise<Doctor | undefined> {
        return await ServiceHelper.getDoctorDataById(req.params.id)
    }

    static async createDoctor(req: Request<DoctorsParams, unknown, CreateDoctorBody>): Promise<Doctor> {
        const doctors = await ServiceHelper.getDoctorsData();

        const existingDoctor = doctors.find((doctor: Doctor) => (
            doctor.firstName === req.body.firstName
            && doctor.lastName === req.body.lastName
        ))

        if (existingDoctor) return existingDoctor;
        const id = randomUUID();
        const createdAt = new Date().toISOString();
        const updatedAt = new Date().toISOString();

        const newDoctor = {
            id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            specialization: req.body.specialization,
            schedule: [],
            createdAt,
            updatedAt
        }

        doctors.push(newDoctor);

        await fs.writeFile(
            paths.DOCTORS,
            JSON.stringify(doctors),
            {encoding: 'utf-8'},
        )
        return newDoctor;
    }

    static async updateDoctor(req: Request<DoctorsParams, unknown, UpdateDoctorBody>): Promise<Doctor> {
        const id = req.params.id;
        const doctors = await ServiceHelper.getDoctorsData();
        const targetDoctor = doctors.find((doctor: Doctor) => doctor.id === id)

        if (!targetDoctor) throw new Error("Specified doctor is not found")
        const updatedDoctor: Doctor = {
            id: targetDoctor.id,
            firstName: req.body.firstName ?? targetDoctor.firstName,
            lastName: req.body.lastName ?? targetDoctor.lastName,
            specialization: req.body.specialization ?? targetDoctor.specialization,
            schedule: req.body.schedule ?? targetDoctor.schedule,
            createdAt: targetDoctor.createdAt,
            updatedAt: new Date().toISOString()
        }

        const index = doctors.findIndex((doctor: Doctor) => doctor.id === targetDoctor.id);
        doctors[index] = updatedDoctor;

        await fs.writeFile(
            paths.DOCTORS,
            JSON.stringify(doctors),
            {encoding: 'utf-8'},
        )

        return updatedDoctor;
    }

    static async deleteDoctor(req: Request<DoctorsParams>): Promise<void> {
        const doctors = await ServiceHelper.getDoctorsData();
        const updatedDoctors = doctors.filter(doctor => doctor.id !== req.params.id)

        await fs.writeFile(
            paths.DOCTORS,
            JSON.stringify(updatedDoctors),
            {encoding: 'utf-8'},
        )
    }
}

class ServiceHelper {
    static async getDoctorsData(query?: DoctorsQuery): Promise<Doctor[]> {

        try {
            const data = await fs.readFile(paths.DOCTORS, {encoding: "utf-8"})
            const doctors = JSON.parse(data)
            if (!query) return doctors;

            const {firstName, lastName, specialization} = query;

            if (firstName) {
                return doctors.filter((doctor: Doctor) => doctor.firstName === firstName)
            } else if (lastName) {
                return doctors.filter((doctor: Doctor) => doctor.lastName === lastName)
            } else if (specialization) {
                return doctors.filter((doctor: Doctor) => doctor.specialization === specialization)
            } else {
                return doctors;
            }

        } catch (err) {
            throw new Error(`Something went wrong while reading doctors.json. Err: ${err}`)
        }
    }

    static async getDoctorDataById(id: string, doctors?: Doctor[]): Promise<Doctor | undefined> {
        const data = doctors ?? await ServiceHelper.getDoctorsData();
        return data.find((doctor: Doctor) => doctor.id === id)
    }
}
