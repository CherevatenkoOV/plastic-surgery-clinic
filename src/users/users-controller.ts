import {Request, Response} from "express";
import {
    UsersParams,
    User,
    UpdateUserData
} from "./types.js";
import {Service, ServiceHelper} from "./service.js";
import {ServiceHelper as DoctorServiceHelper} from "../doctors/service.js"
import {ServiceHelper as PatientServiceHelper} from "../patients/service.js"
import {removeSensitiveData} from "./helpers/remove-sensitive-data.js";
import {Role} from "../shared/roles.js";

// NOTE: refactored
export const getAll = async (req: Request, res: Response<User[]>): Promise<void> => {
    const users = await Service.get();
    const publicUsers = await removeSensitiveData(users)
    res.status(200).send(publicUsers)
}

// NOTE: refactored
export const getById = async (req: Request<UsersParams>, res: Response<User[]>): Promise<void> => {
    const id = req?.params?.id;
    const user = await Service.get(id)
    const publicUser = await removeSensitiveData(user)
    res.status(200).send(publicUser)
}

// TODO: Create service
// export const create = async (req: Request<{}, unknown, CreateUserData>, res: Response<User>): Promise<void> => {
//     const newUser = await Service.create(req);
//     res.status(201).send(newUser)
// }

// NOTE: refactored
export const update = async (req: Request<UsersParams, unknown, UpdateUserData>, res: Response<User>): Promise<void> => {
    const id = req.params.id;
    const userData = req.body;

    const updatedUser = await Service.update(id, userData);

    const publicUser = await removeSensitiveData(updatedUser)
    res.status(200).send(publicUser)
}
// NOTE: refactored
export const remove = async (req: Request<UsersParams>, res: Response<void>): Promise<void> => {
    const id = req.params.id
    const role = req.user!.role

    if (role === Role.DOCTOR) await DoctorServiceHelper.deleteDoctorData(id)
    if (role === Role.PATIENT) await PatientServiceHelper.deletePatientData(id)

    await Service.remove(id)
    res.status(204).send()
}