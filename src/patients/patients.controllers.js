import {getPatientsData} from "./helpers/getPatientsData.js";
import {patientsConstants} from "./patientsConstants.js";
import {updatePatientsData} from "./helpers/updatePatientsData.js";
import {createPatient} from "./helpers/createPatient.js";
import {changePatientData} from "./helpers/changePatientData.js";

export const getPatients = async (req, res) => {
    const patients = await getPatientsData()

    if(!patients) {
        res.status(400).send({message: "When getting patients something went wrong"})
    } else {
        res.status(200).send(patients)
    }
}

export const getPatientById = async (req, res) => {
    const id = req.params.id
    const patients = await getPatientsData()

    if(!patients) {
        res.status(400).send({message: "When getting patients something went wrong"})
    } else {
        const targetPatient = patients.find(patient => patient.id === id)

        if(!targetPatient) {
            res.status(400).send({message: "The patient was not found"})
        } else {
            res.status(200).send(targetPatient)
        }
    }
}

export const putPatient = async (req, res) => {
    const newPatientData = req.body;

    if(!newPatientData) {
        res.status(400).send({message: "Something went wrong with request body of new patient."})
    } else {
        const patients = await getPatientsData();

        if(!patients) {
            res.status(400).send({message: "When getting patients something went wrong"})
        } else {
            const newPatient = await createPatient(newPatientData)
                .catch(err => res.status(400).send({message: err.message}))

            patients.push(newPatient);
            await updatePatientsData(patients);

            res.status(200).send({message: "New patient was created successful."})
        }
    }
}

export const updatePatientById = async (req, res) => {
    const id = req.params.id;
    const newPatientData = req.body;
    const updatedPatient = await changePatientData(newPatientData, id)
    const patients = await getPatientsData();

    if (!patients) {
        res.status(400).send({message: "When getting patients something went wrong"})
    } else {
        const updatedPatients = patients.map(patient => {
            if(patient.id === id) {

                return {
                    ...patient,
                    ...updatedPatient
                }
            }
            return patient;
        })
        await updatePatientsData(updatedPatients)

        res.status(200).send({message: `Patient ${updatedPatient.name} was updated successfully.`})
    }
}


export const deletePatientById = async (req, res) => {
    const id = req.params.id;
    const patients = await getPatientsData();

    if(!patients) {
        res.status(400).send({message: "When getting patients something went wrong"})
    } else {
        const targetPatient = patients.find(patient => patient.id === id);
        if(!targetPatient) {
            res.status(400).send({message: "The patient was not found"})
        } else {
            const updatedPatients = patients.filter(patient => patient.id !== id)
            await updatePatientsData(updatedPatients);
            res.status(200).send(`Patient ${targetPatient.name} was successfully removed`)
        }
    }
}
