import {Schema} from "joi";
import {NextFunction, Request, Response} from "express";


export const validateRequest =  (schema: Schema, property: 'body' | 'query' | 'params'): (req: Request<{}, any, any, any, any>, res: Response, next: NextFunction) => (void) => {
    return (req, res, next) => {

            const {error, value} =  schema.validate(req[property], {
                abortEarly: false,
                stripUnknown: true,
            })

            if(!error) {
                Object.assign(req[property], value);
                return next();
            }

        const errorDetails = error.details.map(detail => ({
            path: detail.path.join('.'),
            message: detail.message
        }))

        return res.status(400).json({
            status: 'error',
            message: 'Validation error',
            errors: errorDetails
        })
    }
}