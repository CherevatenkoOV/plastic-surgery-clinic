import Joi from "joi";
import {id, name, phone, timeISO} from "../../shared/validation/joi.common.js";

export const patientIdSchema = Joi.object({
    id: id
});

export const createPatientSchema = Joi.object({
    firstName: name.required(),
    lastName: name.required(),
    phone: phone.required(),
    appointments: Joi.array().items(
        Joi.object({
            doctorFirstName: name,
            doctorSecondName: name,
            procedureType: Joi.string().min(5).trim().lowercase().required(),
            timeISO: timeISO
        })),
})

export const updatePatientSchema = Joi.object({
    firstName: name,
    lastName: name,
    phone: phone,
    appointments: Joi.array().items(
        Joi.object({
            doctorFirstName: name,
            doctorSecondName: name,
            procedureType: Joi.string().min(5).trim().lowercase().required(),
            timeISO: timeISO
        })),
})