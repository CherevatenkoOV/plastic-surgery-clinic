import fs from 'node:fs/promises';

export async function getPatientsData() {
    const patientsDataPath = "./src/patients/patients.json";

    const patientsDataJSON = await fs.readFile(patientsDataPath, {encoding: "utf-8"})
        .catch(e => console.log(`Something went wrong with getPatientsData: ${e.message}`))

    return JSON.parse(patientsDataJSON)
}