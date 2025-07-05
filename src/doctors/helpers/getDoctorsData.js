import fs from 'node:fs/promises';
import {doctorsConstants} from "../doctorsConstants.js";


export const getDoctorsData = async () => {

    const doctorsDataJSON = await fs.readFile(
        doctorsConstants.paths.DATA_PATH,
        {encoding: "utf-8"}
    )
        .catch(err => {throw new Error(err.message)})

    return JSON.parse(doctorsDataJSON)

}