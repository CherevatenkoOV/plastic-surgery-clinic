import crypto from 'node:crypto';
import {getDoctorsData} from "./getDoctorsData.js";

export const createDoctor = async (newDoctorData) => {
    const {name, specialization} = newDoctorData;

    const doctors = await getDoctorsData();

    if(!doctors) {
        throw new Error("When getting doctors something went wrong")
    } else {
        const doctorIsExist = !!doctors.find(doctor => doctor.name === name)

        if(doctorIsExist) {
            throw new Error("The doctor with the specified name already exists")
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
