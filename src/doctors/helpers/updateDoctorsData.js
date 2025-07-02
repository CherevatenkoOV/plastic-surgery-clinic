import fs from "node:fs/promises";
import {doctorsConstants} from "../doctorsConstants.js";

export async function updateDoctorsData(doctors) {
    const doctorsDataJSON = JSON.stringify(doctors)
    await fs.writeFile(
        doctorsConstants.paths.DATA_PATH,
        doctorsDataJSON,
        {encoding: 'utf-8'},
    ).catch(e => console.log(e.message))
}