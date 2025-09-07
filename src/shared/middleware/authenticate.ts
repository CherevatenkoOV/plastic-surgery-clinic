import jwt from "jsonwebtoken";

export const checkAuthentification = async (req: any, res: any, next: any) => {
    const authToken = req.headers.authorization;
    const token = authToken && authToken.split(' ')[1]

    if(!token) return res.sendStatus(401)

    const accessTokenKey = process.env.ACCESS_TOKEN_SECRET
    if(!accessTokenKey) return res.status(404).send({message: "Access Token Key not found"})

    jwt.verify(token, accessTokenKey, (err: unknown, decoded: unknown) => {
        if (err) { // @ts-ignore
            return res.sendStatus(403)
        }
        req.body.user = decoded;
        next();
    })
}