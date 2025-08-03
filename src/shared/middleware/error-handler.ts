import {NextFunction, Request, Response} from "express";

export const errorHandler = (err: Error, req: Request, res: Response<string>, next: NextFunction) => {
   return res.status(500).send(err.message)
}