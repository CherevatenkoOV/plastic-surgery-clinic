import {NextFunction, Request, Response} from "express";

export const errorHandler = (err: Error, req: Request, res: Response<string>, next: NextFunction) => {
   return res.status(400).send(err.message)
}