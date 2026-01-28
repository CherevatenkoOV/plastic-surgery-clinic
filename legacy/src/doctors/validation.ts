import Joi, {Schema} from "joi";
import {id, name, schedule, specialization} from "../shared/validation/joi-common.js";

export const doctorIdSchema: Schema = Joi.object({
    id: id
});

export const createDoctorSchema: Schema = Joi.object({
    firstName: name.required(),
    lastName: name.required(),
    specialization: specialization.required(),
    schedule: schedule
})

export const updateDoctorSchema: Schema = Joi.object({
    firstName: name,
    lastName: name,
    specialization: specialization,
    schedule: schedule
})

export const searchDoctorSchema: Schema = Joi.object({
    firstName: name,
    lastName: name,
    specialization: specialization,
    sortOrder: Joi.string().min(3).max(4)
})

