import fs from "fs";
import {patientsConstants} from "../patientsConstants.js";

export function updatePatientsData(doctors) {
    const doctorsDataJSON = JSON.stringify(doctors)
    fs.writeFile(
        patientsConstants.DATA_PATH,
        doctorsDataJSON,
        {encoding: 'utf-8'},
        err => {
            if (err) {
                console.log(`Something went wrong with updatePatientsData: ${err.message}`)
            } else {
                console.log("Data is updated")
            }
        })
