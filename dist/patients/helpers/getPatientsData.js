import fs from 'node:fs/promises';
import { patientsConstants } from "../patientsConstants.js";
export const getPatientsData = async () => {
    const patientsDataJSON = await fs.readFile(patientsConstants.paths.DATA_PATH, { encoding: "utf-8" })
        .catch(err => {
        throw new Error("Something went wrong while reading patients.json");
    });
    const patientsObj = JSON.parse(patientsDataJSON);
    if (!patientsObj) {
        throw new Error("Something went wrong while parsing patients.json to JavaScript object");
    }
    else {
        return patientsObj;
    }
};
