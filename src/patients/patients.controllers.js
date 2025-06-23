import {getPatientsData} from "./helpers/getPatientsData.js";

export const getPatients = async (req, res) => {
    const patients = await getPatientsData()
    res.status(200).send(patients)
}

export const getPatientById = async (req, res) => {
    const patients = await getPatientsData()
    const id = req.params.id
    const targetPatient = patients.find(patient => patient.id === id)
    if(targetPatient !== undefined) {
        res.status(200).send(targetPatient)
    }
}
