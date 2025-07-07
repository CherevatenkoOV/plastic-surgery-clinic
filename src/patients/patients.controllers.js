import {getPatientsData} from "./helpers/getPatientsData.js";
import {updatePatientsData} from "./helpers/updatePatientsData.js";
import {createPatientData} from "./helpers/createPatientData.js";
import {changePatientData} from "./helpers/changePatientData.js";
import {getAppointmentsByPatientId} from "./helpers/getAppointmentsByPatientId.js";
import {getPatientDataById} from "./helpers/getPatientDataById.js";
import {deletePatientData} from "./helpers/deletePatientData.js";

export const getPatients = async (req, res) => {
    const patients = await getPatientsData()

    return res.status(200).send(patients)
}

export const getPatientById = async (req, res) => {
    const patientId = req.params.id
    const patients = await getPatientsData();
    const targetPatient = await getPatientDataById(patientId, patients);

    return res.status(200).send(targetPatient)
}

export const putPatient = async (req, res) => {
    const newPatientData = req.body;
    const patients = await getPatientsData();
    const newPatient = await createPatientData(newPatientData, patients)

    patients.push(newPatient);
    await updatePatientsData(patients);

    return res.status(200).send({message: "New patient was created successfully."})
}

export const updatePatientById = async (req, res) => {
    const patientId = req.params.id;
    const newPatientData = req.body;
    const patients = await getPatientsData();
    const updatedPatient = await changePatientData(patientId, newPatientData, patients)

    await updatePatientsData(patients, updatedPatient)

    return res.status(200).send({message: `Patient ${updatedPatient.firstName} ${updatedPatient.lastName} was updated successfully.`})
}


export const deletePatientById = async (req, res) => {
    const patientId = req.params.id;
    const patients = await getPatientsData();
    const targetPatient = await getPatientDataById(patientId, patients);
    const updatedPatients = await deletePatientData(targetPatient, patients)

    await updatePatientsData(updatedPatients);

    return res.status(200).send(`Patient ${updatedPatient.firstName} ${updatedPatient.lastName} was successfully removed`)
}

export const getPatientAppointments = async (req, res) => {
    const patientId = req.params.id;
    const patients = await getPatientsData();
    const patientAppointments = await getAppointmentsByPatientId(patientId, patients)

    if (!patientAppointments.length) {
        return res.status(200).send("The appointment list for specified patient is empty")
    }

    return res.status(200).send(patientAppointments)
}
