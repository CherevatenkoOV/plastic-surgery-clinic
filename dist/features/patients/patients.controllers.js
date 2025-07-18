import { getPatientsData } from "./helpers/getPatientsData.js";
import { updatePatientsData } from "./helpers/updatePatientsData.js";
import { createPatientData } from "./helpers/createPatientData.js";
import { changePatientData } from "./helpers/changePatientData.js";
import { getPatientDataById } from "./helpers/getPatientDataById.js";
import { deletePatientData } from "./helpers/deletePatientData.js";
import { getPatientsAppointments } from "./helpers/getPatientsAppointments.js";
import { handleSearchQuery } from "./helpers/handleSearchQuery.js";
export const getPatients = async (req, res) => {
    const patients = await getPatientsData();
    const queryParams = req.query;
    console.log(queryParams);
    if (!Object.keys(queryParams).length) {
        return res.status(200).send(patients);
    }
    else {
        const handledData = await handleSearchQuery(queryParams, patients);
        return res.status(200).send(handledData);
    }
};
export const getPatientById = async (req, res) => {
    const patientId = req.params.id;
    const patients = await getPatientsData();
    const targetPatient = await getPatientDataById(patientId, patients);
    return res.status(200).send(targetPatient);
};
export const putPatient = async (req, res) => {
    const newPatientData = req.body;
    const patients = await getPatientsData();
    const newPatient = await createPatientData(newPatientData, patients);
    patients.push(newPatient);
    await updatePatientsData(patients);
    return res.status(200).send({ message: "New patient was created successfully." });
};
export const updatePatientById = async (req, res) => {
    const patientId = req.params.id;
    const newPatientData = req.body;
    const patients = await getPatientsData();
    const updatedPatient = await changePatientData(patientId, newPatientData, patients);
    await updatePatientsData(patients, updatedPatient);
    return res.status(200).send({ message: `Patient ${updatedPatient.firstName} ${updatedPatient.lastName} was updated successfully.` });
};
export const deletePatientById = async (req, res) => {
    const patientId = req.params.id;
    const patients = await getPatientsData();
    const targetPatient = await getPatientDataById(patientId, patients);
    const updatedPatients = await deletePatientData(targetPatient, patients);
    await updatePatientsData(updatedPatients);
    return res.status(200).send(`Patient ${updatedPatient.firstName} ${updatedPatient.lastName} was successfully removed`);
};
export const getAppointments = async (req, res) => {
    const patientId = req.query.id;
    const patients = await getPatientsData();
    if (!patientId) {
        const allPatientsAppointments = await getPatientsAppointments(patients);
        return res.status(200).send(allPatientsAppointments);
    }
    else {
        const targetPatient = await getPatientDataById(patientId, patients);
        return res.status(200).send(targetPatient.appointments);
    }
};
