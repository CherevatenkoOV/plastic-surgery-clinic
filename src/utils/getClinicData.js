import fs from 'node:fs/promises';
import {parseNested} from "./parseNested.js";

export async function getClinicData() {
    const clinicDataPath = "./clinicData.json";
    try {
        const clinicDataJSON = await fs.readFile(clinicDataPath, {encoding: "utf-8"}, (err, data) => {
            if (err) throw err;
            return data;
        });
        return parseNested(clinicDataJSON);
    } catch(e) {
        console.log(`Something went wrong: ${e.message}`)
    }

}