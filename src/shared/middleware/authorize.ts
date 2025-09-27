import {Request, Response, NextFunction, RequestHandler} from "express";
import {Role} from "../roles.js";

export const authorize = (roles: Role[]): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        if(!user || !roles.includes(user.role as Role)) {
            return res.status(401).send({
                message: "Access denied. Your account does not have the required permissions."
            })
        }

        next()
    }
}

