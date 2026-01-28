import Joi, {Schema} from "joi";
import {id, name, phone, timeISO} from "../shared/validation/joi-common.js";

export const patientIdSchema: Schema = Joi.object({
    id: id
});

export const createPatientSchema: Schema = Joi.object({
    firstName: name.required(),
    lastName: name.required(),
    phone: phone.required(),
})

export const updatePatientSchema: Schema = Joi.object({
    firstName: name,
    lastName: name,
    phone: phone,
})

export const searchPatientSchema: Schema = Joi.object({
    firstName: name,
    lastName: name
})