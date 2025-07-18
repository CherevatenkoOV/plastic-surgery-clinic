import Joi, {Schema} from "joi";
import {id, name, phone, timeISO} from "../../shared/validation/joi.common.js";

export const patientIdSchema: Schema = Joi.object({
    id: id
});

export const createPatientSchema: Schema = Joi.object({
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

export const updatePatientSchema: Schema = Joi.object({
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

export const searchPatientSchema: Schema = Joi.object({
    firstName: name,
    lastName: name
})