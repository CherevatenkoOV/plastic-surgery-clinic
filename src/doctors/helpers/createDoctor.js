import crypto from 'node:crypto';
import {getDoctorsData} from "./getDoctorsData.js";
import {doctorsConstants} from "../doctorsConstants.js";

export const createDoctor = async (newDoctorData) => {
    const {name, specialization} = newDoctorData;

    const doctors = await getDoctorsData();

    if(!doctors) {
        throw new Error(doctorsConstants.errorMessages.GETTING_ALL_DOCTORS_ERROR)
    } else {
        const doctorIsExist = !!doctors.find(doctor => doctor.name === name)

        if(doctorIsExist) {
            throw new Error(doctorsConstants.errorMessages.DOCTOR_ALREADY_EXISTS)
        } else {
            let uuid = crypto.randomUUID();

            while(!!doctors.find(doctor => doctor.id === uuid)) {
                uuid = crypto.randomUUID();
            }

            const id = uuid;

            return {
                id,
                name,
                specialization,
                schedule: [],
                appointments: []
            }
        }
    }
}
