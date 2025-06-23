import fs from "fs";
const doctorsDataPath = "../doctors.json"

export function updateDoctorsData(doctors) {
    const doctorsDataJSON = JSON.stringify(doctors)

    fs.writeFile(doctorsDataPath, doctorsDataJSON, {encoding: 'utf-8'}, err => {
        if(err) {
            console.log(`Something went wrong with updateDoctorsData: ${err.message}`)
        } else {
            console.log("Data is updated")
        }
    })

}