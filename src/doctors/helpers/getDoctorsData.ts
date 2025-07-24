import fs from 'node:fs/promises';
import {doctorsConstants} from "../doctorsConstants.js";
import {Doctors} from "../doctors.types.js"

export const getDoctorsData = async (): Promise<Doctors> => {
    const doctorsDataJSON = await fs.readFile(
        doctorsConstants.paths.DATA_PATH,
        {encoding: "utf-8"}
    )
        .catch(err => {
            throw new Error(`Something went wrong while reading doctors.json. Err: ${err.message}`)
        })

    const doctorsObj = JSON.parse(doctorsDataJSON);

    if(!doctorsObj) {
        throw new Error("Something went wrong while parsing doctors.json to JavaScript object")
    } else {
        return doctorsObj
    }
}