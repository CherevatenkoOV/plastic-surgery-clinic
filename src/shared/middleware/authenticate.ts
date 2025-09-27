import jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.headers.authorization;
    const accessToken = authToken && authToken.split(' ')[1]

    if(!accessToken) return res.sendStatus(401)

    const accessTokenKey = process.env.ACCESS_TOKEN_SECRET
    if(!accessTokenKey) return res.status(404).send({message: "Access Token Key not found"})

    jwt.verify(accessToken, accessTokenKey, (err: unknown, decoded: unknown) => {
        if (err) { // @ts-ignore
            return res.sendStatus(403)
        }

        req.user = decoded as {id: string, role: string};
        next();
    })
}