import {Request, Response} from "express";
import {CreateDoctorBody, Doctor, DoctorsParams, DoctorsQuery, UpdateDoctorBody} from "./types.js";
import {Service} from "./service.js";


export const getAll = async (req: Request<DoctorsParams, unknown, unknown, DoctorsQuery>, res: Response<Doctor[]>): Promise<void> => {
    const doctors = await Service.getDoctors(req)
    res.status(200).send(doctors)
}

export const getById = async (req: Request<DoctorsParams>, res: Response<Doctor>): Promise<void> => {
    const doctor = await Service.getDoctorById(req)
    res.status(200).send(doctor)
}

export const create = async (req: Request<DoctorsParams, unknown, CreateDoctorBody>, res: Response<Doctor>): Promise<void> => {
    const doctor =await Service.createDoctor(req)
    res.status(200).send(doctor)
}

export const update = async (req: Request<DoctorsParams, unknown, UpdateDoctorBody>, res: Response<Doctor>): Promise<void> => {
    const updatedDoctor = await Service.updateDoctor(req)
    res.status(200).send(updatedDoctor)
}

export const remove = async (req: Request<DoctorsParams>, res: Response<void>): Promise<void> => {
    await Service.deleteDoctor(req)
    res.status(204).send()
}

