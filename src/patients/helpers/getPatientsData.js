import fs from 'node:fs/promises';
import {patientsConstants} from "../patientsConstants.js";

export const getPatientsData = async () => {
    const patientsDataJSON = await fs.readFile(
        patientsConstants.paths.DATA_PATH,
        {encoding: "utf-8"}
    )
        .catch(e => console.log(`Something went wrong with getPatientsData: ${e.message}`))

    return JSON.parse(patientsDataJSON)
}