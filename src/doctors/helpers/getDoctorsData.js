import fs from 'node:fs/promises';
import {doctorsConstants} from "../doctorsConstants.js";

export const getDoctorsData = async () => {
    const doctorsDataJSON = await fs.readFile(
        doctorsConstants.paths.DATA_PATH,
        {encoding: "utf-8"}
    )
        .catch(err => {
            throw new Error("Something went wrong while reading doctors.json")
        })

    const doctorsObj = JSON.parse(doctorsDataJSON);

    if(!doctorsObj) {
        throw new Error("Something went wrong while parsing doctors.json to JavaScript object")
    } else {
        return doctorsObj
    }
}