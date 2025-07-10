export const validateRequest = (schema, property = 'body') => {
    return (req, res, next) => {
        const {error, value} = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true,
        })

        if (!error) {
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