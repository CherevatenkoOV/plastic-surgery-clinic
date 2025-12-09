import {Request, Response} from "express";
import {DoctorInviteToken, DoctorsParamsDto, FullDoctorDto, UpdateDoctorDto} from "./types.js";
import {Service} from "./service.js";
import {Service as UserService} from "../users/service.js"
import {Appointment} from "../appointments/types.js";
import {Role} from "../shared/roles.js";
import {sanitizeUser} from "../users/helpers/sanitize-user.js";
import {mergeUserWithRole} from "../shared/helpers/merge-user-with-role.js";


// NOTE: done
export const getAll = async (req: Request, res: Response<FullDoctorDto[] | {message: string}>): Promise<void> => {
    const loggedUser = req.user;

    if(!loggedUser) {
        res.status(401).send({message: "User not authenticated"})
        return
    }

    const doctors = await Service.get()

    if (!doctors.length) {
        res.status(404).send({message: "Doctors not found"})
        return
    }

    res.status(200).send(doctors)
}

// NOTE: done
export const getById = async (req: Request<DoctorsParamsDto>, res: Response<FullDoctorDto | {
    message: string
}>): Promise<void> => {
    const id = req.params.id;

    if (!id) {
        res.status(400).send({message: "Missing id parameter"})
        return
    }

    const doctor = await Service.getById(id)

    if(!doctor) {
        res.status(404).send({message: "Doctor was not found"})
        return
    }

    res.status(200).send(doctor)
}


// NOTE: done
export const getMe = async (req: Request, res: Response<FullDoctorDto | {
    message: string
}>) => {
    const loggedUser = req.user!;
    const id = loggedUser.id;

    const doctor = await Service.getById(id)

    if(!doctor) {
        res.status(404).send({message: "Doctor was not found"})
        return
    }

    return res.status(200).send(doctor)
}

// NOTE: done
export const updateById = async (req: Request<DoctorsParamsDto, unknown, UpdateDoctorDto>, res: Response<FullDoctorDto | {
    message: string
}>): Promise<void> => {
    const id = req.params.id!
    if (!id) {
        res.status(400).send({message: "Missing id parameter"})
        return
    }

    const doctorData = req.body

    const updatedDoctor = await Service.update(id, doctorData)
    res.status(200).send(updatedDoctor)
}

// NOTE: done
export const updateMe = async (req: Request<unknown, unknown, UpdateDoctorDto>, res: Response<FullDoctorDto | {
    message: string
}>): Promise<void> => {
    const loggedUser = req.user!
    const doctorData = req.body

    const updatedDoctor = await Service.update(loggedUser.id, doctorData)
    res.status(200).send(updatedDoctor)
}

export const deleteMe = async (req: Request<DoctorsParamsDto>, res: Response<boolean | {message: string}>): Promise<void> => {
    const loggedUser = req.user!

    await Service.delete(loggedUser.id)
    res.status(204).send(true)

}

// NOTE: done
export const deleteById = async (req: Request<DoctorsParamsDto>, res: Response<boolean | {message: string}>): Promise<void> => {
    const id = req.params.id
    if (!id) {
        res.status(400).send({message: "Missing id parameter"})
        return
    }

    await Service.delete(id)
    res.status(204).send(true)
}


export const getAppointments = async (req: Request, res: Response<Appointment[]>): Promise<void> => {
    const appointments = await Service.getAppointments(req)
    res.status(200).send(appointments)
}

export const inviteDoctor = async (req: Request, res: Response<DoctorInviteToken>): Promise<void> => {
    await Service.sendInviteDoctor(req)
    res.status(200).send()
}

