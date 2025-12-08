import {Request, Response} from "express";
import {
    UsersParams,
    User,
    UpdateUserDto, UserDto
} from "./types.js";
import {Service, ServiceHelper} from "./service.js";
import {ServiceHelper as DoctorServiceHelper} from "../doctors/service.js"
import {ServiceHelper as PatientServiceHelper} from "../patients/service.js"
import {sanitizeUsers} from "./helpers/sanitize-users.js";
import {Role} from "../shared/roles.js";

// NOTE: done
export const getAll = async (req: Request, res: Response<UserDto[]>): Promise<void> => {
    const users = await Service.get();

    res.status(200).send(users)
}

// NOTE: done
export const getById = async (req: Request<UsersParams>, res: Response<UserDto>): Promise<void> => {
    const id = req.params.id;
    const user = await Service.getById(id)

    res.status(200).send(user)
}

// NOTE: done
export const getByEmail = async (req: Request<{}, {}, {}, {email: string}>, res: Response<UserDto>): Promise<void> => {
    const email = req.query.email
    const user = await Service.getByEmail(email)

    res.status(200).send(user)
}

// TODO: Create service
// export const create = async (req: Request<{}, unknown, CreateUserData>, res: Response<User>): Promise<void> => {
//     const newUser = await Service.create(req);
//     res.status(201).send(newUser)
// }

// NOTE: refactored
export const update = async (req: Request<UsersParams, unknown, UpdateUserDto>, res: Response<UserDto>): Promise<void> => {
    const id = req.params.id;
    const userData = req.body;

    const updatedUser = await Service.update(id, userData);

    res.status(200).send(updatedUser)
}
// NOTE: refactored
export const remove = async (req: Request<UsersParams>, res: Response<void>): Promise<void> => {
    const id = req.params.id
    const role = req.user!.role

    // TODO: replace to service
    if (role === Role.DOCTOR) await DoctorServiceHelper.deleteDoctorData(id)
    if (role === Role.PATIENT) await PatientServiceHelper.deletePatientData(id)

    await Service.remove(id)
    res.status(204).send()
}