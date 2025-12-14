import {Request, Response} from "express";
import {
    UsersParams,
    UpdateUserDto, UserDto
} from "./types.js";
import {Service} from "./service.js";
import {ServiceHelper as DoctorServiceHelper} from "../doctors/service.js"
import {ServiceHelper as PatientServiceHelper} from "../patients/service.js"
import {Role} from "../shared/roles.js";
import {sanitizeUsers} from "./helpers/sanitize-users.js";
import {sanitizeUser} from "./helpers/sanitize-user.js";

// DONE
export const getAll = async (req: Request, res: Response<UserDto[]>): Promise<void> => {
    const users = await Service.get();
    const publicUsers = sanitizeUsers(users)

    res.status(200).send(publicUsers)
}

// DONE
export const getById = async (req: Request<UsersParams>, res: Response<UserDto | {message: string}>): Promise<void> => {
    const id = req.params.id;
    const user = await Service.getById(id)

    const publicUser = sanitizeUser(user!)

    res.status(200).send(publicUser)
}

// DONE
export const getByEmail = async (req: Request<{}, {}, {}, {email: string}>, res: Response<UserDto | {message: string}>): Promise<void> => {
    const email = req.query.email
    const user = await Service.getByEmail(email)

    const publicUser = sanitizeUser(user!)
    res.status(200).send(publicUser)
}

// NOTE: done
export const update = async (req: Request<UsersParams, unknown, UpdateUserDto>, res: Response<UserDto | {message: string}>): Promise<void> => {
    const id = req.params.id;
    const userData = req.body;

    const updatedUser = await Service.update(id, userData);
    if(!updatedUser) {
        res.status(404).send({message: "User with specified id was not found"})
        return
    }
    const publicUser = sanitizeUser(updatedUser)

    res.status(200).send(publicUser)
}

export const remove = async (req: Request<UsersParams>, res: Response<{ message: string }>): Promise<void> => {
    const id = req.params.id
    const role = req.user!.role

    if (role === Role.DOCTOR) await DoctorServiceHelper.deleteDoctorData(id)
    if (role === Role.PATIENT) await PatientServiceHelper.deletePatientData(id)

    await Service.remove(id)
    res.status(204).send({message: "User was successfully deleted"})
}