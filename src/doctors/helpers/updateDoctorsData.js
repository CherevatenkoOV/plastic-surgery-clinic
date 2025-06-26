import fs from "fs";
import {doctorsConstants} from "../doctorsConstants.js";


export function updateDoctorsData(doctors) {
    const doctorsDataJSON = JSON.stringify(doctors)

    fs.writeFile(
        doctorsConstants.DATA_PATH,
        doctorsDataJSON,
        {encoding: 'utf-8'},
        err => {
            if (err) {
                console.log(`Something went wrong with updateDoctorsData: ${err.message}`)
            } else {
                console.log("Data is updated")
            }
        })

}