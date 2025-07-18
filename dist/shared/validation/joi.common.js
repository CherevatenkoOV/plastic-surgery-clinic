import Joi from 'joi';
export const id = Joi.string().guid({
    version: ['uuidv4']
});
export const timeISO = Joi.string().isoDate();
export const name = Joi.string().min(2).max(30).pattern(/^[A-Z][a-z]*$/);
export const phone = Joi.string().pattern(/^\+?[0-9\s\-()]{7,20}$/);
export const specialization = Joi.string().min(5).trim().lowercase();
export const schedule = Joi.array().length(7).items(Joi.object({
    _day: Joi.number().min(0).max(6),
    day: Joi.string().min(6).pattern(/^[A-Z][a-z]*$/),
    isAvailable: Joi.bool().required(),
    start: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/),
    end: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/)
}));
