import {getPatientsData} from "./helpers/getPatientsData.js";
import {patientsConstants} from "./patientsConstants.js";

export const getPatients = async (req, res) => {
    const patients = await getPatientsData()

    if(!patients) {
        res.status(400).send(patientsConstants.GETTING_ALL_PATIENTS_ERROR)
    } else {
        res.status(200).send(patients)
    }
}

export const getPatientById = async (req, res) => {
    const id = req.params.id
    const patients = await getPatientsData()

    if(!patients) {
        res.status(400).send(patientsConstants.GETTING_ALL_PATIENTS_ERROR)
    } else {
        const targetPatient = patients.find(patient => patient.id === id)

        if(!targetPatient) {
            res.status(400).send(patientsConstants.GETTING_PATIENT_ERROR)
        } else {
            res.status(200).send(targetPatient)
        }
    }
}
