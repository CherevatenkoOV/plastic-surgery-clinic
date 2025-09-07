import {Request, Response, NextFunction} from "express";
import {Role} from "../roles.js";

export const authorize = (role: Role) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        console.log(user)
        if(user!.role !== role) return res.status(401).send({message: "Access denied. Your account does not have the required permissions."})
        next()
    }
}

