import {Request, Response} from "express";
import {DoctorInviteToken, DoctorsParams, UpdateDoctorDto} from "./types.js";
import {Service} from "./service.js";
import {Service as UserService} from "../users/service.js"
import {FullUser, User} from "../users/types.js";
import {Appointment} from "../appointments/types.js";
import {sanitizeUsers} from "../users/helpers/sanitizeUsers.js";
import {Role} from "../shared/roles.js";
import {mergeUsersWithRoles} from "../shared/helpers/mergeUsersWithRoles.js";
import {sanitizeUser} from "../users/helpers/sanitizeUser.js";
import {mergeUserWithRole} from "../shared/helpers/mergeUserWithRole.js";


// NOTE: refactored
export const getAll = async (req: Request, res: Response<FullUser[]>): Promise<Response<FullUser[]>> => {
    const loggedUser = req.user;

    if (loggedUser && (loggedUser.role === Role.ADMIN || loggedUser.role === Role.PATIENT)) {
        const users = await UserService.get()
        const sanitizedUsers = sanitizeUsers(users)

        const doctors = await Service.getAll()

        const fullUsers = mergeUsersWithRoles(sanitizedUsers, doctors)
        if (!fullUsers.length) return res.sendStatus(404)

        return res.status(200).send(fullUsers)
    }

    throw new Error("Current user doesn't have the access to requested information.")

}

// NOTE: refactored
export const getById = async (req: Request, res: Response<FullUser | {
    message: string
}>) => {
    const id = req.params.id;
    const loggedUser = req.user!;

    if (!id) return res.status(400).send({message: "Missing id parameter"})
    if (!(loggedUser.role === Role.ADMIN) && !(loggedUser.role === Role.PATIENT)) return res.status(403).send(({message: "Current user doesn't have the access to requested information."}))

    // HACK: getting user by id should return object. refactor after implementing repository
    const user = await UserService.get(id)
    if (!user[0]) return res.status(404).send({message: "Profile of doctor was not found"})
    // HACK: getting doctor by id should return object. refactor after implementing repository
    const doctor = await Service.getById(id)
    if (!doctor[0]) return res.status(404).send({message: "Doctor's role details were not found"})

    const sanitizedUser = sanitizeUser(user[0])
    const fullUser = mergeUserWithRole(sanitizedUser, doctor[0])

    return res.status(200).send(fullUser)
}

// export const getById = async (req: Request, res: Response<FullUser[]>): Promise<void> => {
//     const doctor = await Service.get(req)

//     if (!doctor.length) res.sendStatus(404)
//
//     const publicDoctor = await sanitizeUsers(doctor)
//     res.status(200).send(publicDoctor)
// }

// NOTE: created
export const getMe = async (req: Request, res: Response<FullUser | {
    message: string
}>) => {
    const loggedUser = req.user!;
    const id = loggedUser.id;

    if(loggedUser.role !== Role.DOCTOR) return res.status(403).send({message: "Current user doesn't have the access to requested information."})
    if (req.url !== '/me') return res.status(400).send({message: "Bad request"})

    // HACK: getting user by id should return object. refactor after implementing repository
    const user = await UserService.get(id)
    if (!user[0]) return res.status(404).send({message: "Profile of doctor was not found"})
    // HACK: getting doctor by id should return object. refactor after implementing repository
    const doctor = await Service.getById(id)
    if (!doctor[0]) return res.status(404).send({message: "Doctor's role details were not found"})

    const sanitizedUser = sanitizeUser(user[0])
    const fullUser = mergeUserWithRole(sanitizedUser, doctor[0])

    return res.status(200).send(fullUser)
}

export const updateById = async (req: Request<DoctorsParams, unknown, UpdateDoctorDto>, res: Response<FullUser>): Promise<void> => {
    const userId = req.params.id


    const updatedDoctor = await Service.update(req)
    res.status(200).send(updatedDoctor)
}
// NOTE: previous version
// export const update = async (req: Request<{}, unknown, UpdateDoctorBody>, res: Response<FullUser>): Promise<void> => {
//     const updatedDoctor = await Service.update(req)
//     res.status(200).send(updatedDoctor)
// }


export const updateMe = async (req: Request<{}, unknown, UpdateDoctorDto>, res: Response<FullUser>): Promise<void> => {
    const userId = req.params.id ?? req.user!.id

    const updatedDoctor = await Service.update(req)
    res.status(200).send(updatedDoctor)
}

export const remove = async (req: Request, res: Response<void>): Promise<void> => {
    await Service.deleteDoctor(req)
    res.status(204).send()
}

export const getAppointments = async (req: Request, res: Response<Appointment[]>): Promise<void> => {
    const appointments = await Service.getAppointments(req)
    res.status(200).send(appointments)
}

export const inviteDoctor = async (req: Request, res: Response<DoctorInviteToken>): Promise<void> => {
    await Service.sendInviteDoctor(req)
    res.status(200).send()
}

