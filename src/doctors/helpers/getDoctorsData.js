import fs from 'node:fs/promises';

export const getDoctorsData = async () => {
    const doctorsDataPath = "./src/doctors/doctors.json";

    const doctorsDataJSON = await fs.readFile(doctorsDataPath, {encoding: "utf-8"})
        .catch(e => console.log(`Something went wrong with getDoctorsData: ${e.message}`))

    return JSON.parse(doctorsDataJSON)

}