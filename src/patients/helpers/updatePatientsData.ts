import fs from "node:fs/promises";
import {patientsConstants} from "../patientsConstants.js";
import {Patient, Patients} from "../patients.types.js";

export async function updatePatientsData(patients: Patients, updatedPatient: Patient | null = null): Promise<Patient | void> {
    let patientsDataJSON;

    if(!updatedPatient) {
        patientsDataJSON = JSON.stringify(patients);
    } else {
        const updatedPatients = patients.map(patient => {
            if (patient.id === updatedPatient.id) {

                return {
                    ...patient,
                    ...updatedPatient
                }
            }
            return patient;
        })
        patientsDataJSON = JSON.stringify(updatedPatients);
    }

    fs.writeFile(
        patientsConstants.paths.DATA_PATH,
        patientsDataJSON,
        {encoding: 'utf-8'}
    ).catch(err => {
        throw new Error("Something went wrong with updating patients data.")
    })
}
