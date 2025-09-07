import {Request, Response, NextFunction} from "express";
import {Role} from "../roles.js";

export const checkRole = (role: Role) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.body.user;
        // JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())

        console.log(user)
        if(role === Role.DOCTOR) {
            res.redirect(``)
        }
        next()
    }
}

