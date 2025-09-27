// import {Request, Response} from "express";
// import {
//     UsersParams,
//     User, UpdateUserBody, CreateUserData
// } from "./types.js";
// import {Service} from "./service.js";
//
// // NOTE: FOR ADMIN
// export const getAll = async (req: Request, res: Response<User[]>): Promise<void> => {
//     const users = await Service.getAll();
//     res.status(200).send(users)
// }
//
// // NOTE: FOR ADMIN
// export const getById = async (req: Request<UsersParams>, res: Response<User | undefined>): Promise<void> => {
//     const user = await Service.getById(req)
//     res.status(200).send(user)
// }
//
// // NOTE: FOR ADMIN
// export const create = async (req: Request<{}, unknown, CreateUserData>, res: Response<User>): Promise<void> => {
//     const newUser = await Service.createUser(req);
//     res.status(201).send(newUser)
// }
//
//
// // NOTE: FOR ADMIN
// export const update = async (req: Request<UsersParams, unknown, UpdateUserBody>, res: Response<User>): Promise<void> => {
//     const updatedUser = await Service.update(req);
//     res.status(200).send(updatedUser)
// }
// // NOTE: FOR ADMIN
// export const remove = async (req: Request<UsersParams>, res: Response<void>): Promise<void> => {
//     await Service.remove(req)
//     res.status(204).send()
// }