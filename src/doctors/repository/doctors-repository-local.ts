import {IDoctorsRepository} from "./i-doctors-repository.js";
import {Doctor, DoctorsQueryDto, UpdateDoctorData} from "../types.js";
import fs from "node:fs/promises";
import {paths} from "../../shared/paths.js";

export class DoctorsRepositoryLocal implements IDoctorsRepository {
    private doctors: Doctor[] = [];
    async find(filter?: DoctorsQueryDto): Promise<Doctor[]> {
        const doctorsData = await fs.readFile(paths.DOCTORS, {encoding: "utf-8"})
        const doctors = JSON.parse(doctorsData)

        if (!filter || Object.keys(filter).length === 0) return doctors

        let filteredDoctors = doctors;
        if (filter?.specialization) filteredDoctors = filteredDoctors.filter((d: Doctor) => d.specialization?.toLowerCase() === filter.specialization?.toLowerCase())

        if (!filteredDoctors.length) throw new Error("The specified doctor(s) were not found")

        return filteredDoctors
    }

    async findById(id: string): Promise<Doctor | undefined> {
        const doctors = await this.find()
        const targetDoctor = doctors.find(d => d.userId === id)
        if(!targetDoctor)  throw new Error("The specified doctor was not found")

        return targetDoctor
    }

    async create(doctorData: Doctor): Promise<Doctor> {
        const {userId, specialization, schedule} = doctorData;

        const doctors = await this.find();
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

    async update(userId: string, doctorData: UpdateDoctorData): Promise<Doctor> {
        const doctors = await this.find();
        const targetDoctor = doctors.find((d) => d.userId === userId)
        let doctor: Doctor;

        if (!targetDoctor) {
            doctor = await this.create({
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

    async delete(userId: string): Promise<void> {
        const doctors = await this.find();
        const updatedDoctors = doctors.filter(doctor => doctor.userId !== userId)

        await fs.writeFile(
            paths.DOCTORS,
            JSON.stringify(updatedDoctors),
            {encoding: 'utf-8'},
        )
    }


}