import {Request, Response} from "express";
import {DoctorInviteToken, DoctorsParamsDto, FullDoctorDto, UpdateDoctorDto} from "./types.js";
import {DoctorsService} from "./service.js";
import {Appointment} from "../appointments/types.js";

export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) {}

    async getAll(req: Request, res: Response<FullDoctorDto[] | { message: string }>): Promise<void> {
        const filter = req.query
        const doctors = await this.doctorsService.get(filter)

        if (!doctors.length) {
            res.status(404).send({message: "Doctors not found"})
            return
        }

        res.status(200).send(doctors)
    }

    async getById(req: Request<DoctorsParamsDto>, res: Response<FullDoctorDto | {
        message: string
    }>): Promise<void> {
        const id = req.params.id;

        if (!id) {
            res.status(400).send({message: "Missing id parameter"})
            return
        }

        const doctor = await this.doctorsService.getById(id)

        if (!doctor) {
            res.status(404).send({message: "Doctor was not found"})
            return
        }

        res.status(200).send(doctor)
    }

    async getMe(req: Request, res: Response<FullDoctorDto | {
        message: string
    }>) {
        const loggedUser = req.user!;
        const id = loggedUser.id;

        const doctor = await this.doctorsService.getById(id)

        if (!doctor) {
            res.status(404).send({message: "Doctor was not found"})
            return
        }

        return res.status(200).send(doctor)
    }

    async updateById(req: Request<DoctorsParamsDto, unknown, UpdateDoctorDto>, res: Response<FullDoctorDto | {
        message: string
    }>): Promise<void> {
        const id = req.params.id!
        if (!id) {
            res.status(400).send({message: "Missing id parameter"})
            return
        }

        const doctorData = req.body

        const updatedDoctor = await this.doctorsService.update(id, doctorData)
        res.status(200).send(updatedDoctor)
    }

    async updateMe(req: Request<unknown, unknown, UpdateDoctorDto>, res: Response<FullDoctorDto | {
        message: string
    }>): Promise<void> {
        const loggedUser = req.user!
        const doctorData = req.body

        const updatedDoctor = await this.doctorsService.update(loggedUser.id, doctorData)
        res.status(200).send(updatedDoctor)
    }

    async deleteMe(req: Request<DoctorsParamsDto>, res: Response<boolean | { message: string }>): Promise<void> {
        const loggedUser = req.user!

        await this.doctorsService.delete(loggedUser.id)
        res.status(204).send(true)

    }

    deleteById = async (req: Request<DoctorsParamsDto>, res: Response<boolean | {
        message: string
    }>): Promise<void> => {
        const id = req.params.id
        if (!id) {
            res.status(400).send({message: "Missing id parameter"})
            return
        }

        await this.doctorsService.delete(id)
        res.status(204).send(true)
    }


    async getAppointments(req: Request, res: Response<Appointment[]>): Promise<void> {
        const appointments = await this.doctorsService.getAppointments(req)
        res.status(200).send(appointments)
    }

    async inviteDoctor(req: Request, res: Response<DoctorInviteToken>): Promise<void> {
        await this.doctorsService.sendInviteDoctor(req)
        res.status(200).send()
    }

}

