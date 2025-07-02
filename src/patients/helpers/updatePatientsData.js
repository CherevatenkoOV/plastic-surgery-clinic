import fs from "node:fs/promises";
import {patientsConstants} from "../patientsConstants.js";

export async function updatePatientsData(patients) {
    const patientsDataJSON = JSON.stringify(patients)
    fs.writeFile(
        patientsConstants.paths.DATA_PATH,
        patientsDataJSON,
        {encoding: 'utf-8'}
    ).catch(err => console.log(`Something went wrong with updatePatientsData: ${err.message}`))

}
