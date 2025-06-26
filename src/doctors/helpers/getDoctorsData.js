import fs from 'node:fs/promises';
import {doctorsConstants} from "../doctorsConstants.js";


export const getDoctorsData = async () => {

    const doctorsDataJSON = await fs.readFile(
        doctorsConstants.DATA_PATH,
        {encoding: "utf-8"}
    )
        .catch(e => console.log(`Something went wrong with getDoctorsData: ${e.message}`))

    return JSON.parse(doctorsDataJSON)

}