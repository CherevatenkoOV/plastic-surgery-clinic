import {getPatientsData} from "./helpers/getPatientsData.js";
import {patientsConstants} from "./patientsConstants.js";
import {updatePatientsData} from "./helpers/updatePatientsData.js";
import {createPatient} from "./helpers/createPatient.js";

export const getPatients = async (req, res) => {
    const patients = await getPatientsData()

    if(!patients) {
        res.status(400).send(patientsConstants.errorMessages.GETTING_ALL_PATIENTS_ERROR)
    } else {
        res.status(200).send(patients)
    }
}

export const getPatientById = async (req, res) => {
    const id = req.params.id
    const patients = await getPatientsData()

    if(!patients) {
        res.status(400).send(patientsConstants.errorMessages.GETTING_ALL_PATIENTS_ERROR)
    } else {
        const targetPatient = patients.find(patient => patient.id === id)

        if(!targetPatient) {
            res.status(400).send(patientsConstants.errorMessages.GETTING_PATIENT_ERROR)
        } else {
            res.status(200).send(targetPatient)
        }
    }
}

export const putPatient = async (req, res) => {
    const newPatientData = req.body;

    if(!newPatientData) {
        res.status(400).send({message: patientsConstants.errorMessages.REQUEST_BODY_OF_NEW_PATIENT_ERROR})
    } else {
        const patients = await getPatientsData();

        if(!patients) {
            res.status(400).send({message: patientsConstants.errorMessages.GETTING_ALL_PATIENTS_ERROR})
        } else {
            const newPatient = await createPatient(newPatientData)
                .catch(err => res.status(400).send({message: err.message}))

            patients.push(newPatient);
            await updatePatientsData(patients);

            res.status(200).send({message: patientsConstants.successMessages.PATIENT_CREATED_SUCCESSFULLY})
        }
    }
}

export const deletePatientById = async (req, res) => {
    const id = req.params.id;
    const patients = await getPatientsData();

    if(!patients) {
        res.status(400).send({message: patientsConstants.errorMessages.GETTING_ALL_PATIENTS_ERROR})
    } else {
        const targetPatient = patients.find(patient => patient.id === id);
        if(!targetPatient) {
            res.status(400).send({message: patientsConstants.errorMessages.GETTING_PATIENT_ERROR})
        } else {
            const updatedPatients = patients.filter(patient => patient.id !== id)
            await updatePatientsData(updatedPatients);
            res.status(200).send(`Patient ${targetPatient.name} was successfully removed`)
        }
    }
}
