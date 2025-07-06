import fs from "node:fs/promises";
import {doctorsConstants} from "../doctorsConstants.js";

export async function updateDoctorsData(doctors, updatedDoctor = null) {
    let doctorsDataJSON;

    if (!updatedDoctor) {
        doctorsDataJSON = JSON.stringify(doctors)
    } else {
        const updatedDoctors = doctors.map(doctor => {
            if (doctor.id === updatedDoctor.id) {
                return {
                    ...doctor,
                    ...updatedDoctor
                }
            }
            return doctor;
        })
        doctorsDataJSON = JSON.stringify(updatedDoctors)
    }

    await fs.writeFile(
        doctorsConstants.paths.DATA_PATH,
        doctorsDataJSON,
        {encoding: 'utf-8'},
    ).catch(err => {
        throw new Error("Something went wrong with updating doctors data.")
    })
}