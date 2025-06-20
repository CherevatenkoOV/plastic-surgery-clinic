import fsPromises from "fs/promises";
import fs from "fs";
import {getClinicData} from "./getClinicData.js";
const clinicDataPath = "./clinicData.json";
const clinicData = await getClinicData();
const doctors = clinicData["Doctors"]
const patients = clinicData["Patients"]

export function updateClinicData(updatedDoctors = doctors, updatedPatients = patients) {
    clinicData["Doctors"] = updatedDoctors;
    clinicData["Patients"] = updatedPatients;
    const clinicDataJSON = JSON.stringify(clinicData)
    fs.writeFile(clinicDataPath, clinicDataJSON, {encoding: 'utf-8'}, err => {
        if(err) {
            console.error(err)
        } else {
            console.log("Data is updated")
        }
    })

}