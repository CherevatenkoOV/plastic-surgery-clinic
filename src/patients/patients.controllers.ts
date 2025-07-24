import {getPatientsData} from "./helpers/getPatientsData.js";
import {updatePatientsData} from "./helpers/updatePatientsData.js";
import {createPatientData} from "./helpers/createPatientData.js";
import {changePatientData} from "./helpers/changePatientData.js";
import {getPatientDataById} from "./helpers/getPatientDataById.js";
import {deletePatientData} from "./helpers/deletePatientData.js";
import {handleSearchQuery} from "./helpers/handleSearchQuery.js";
import {
    PatientsQuery,
    Id,
    NewPatientData,
    Patient,
    Patients,
} from "./patients.types.js";
import {Request, Response} from "express";

export const getPatients = async (req: Request<{}, any, any, PatientsQuery>, res: Response<Patients | Patient>) => {
    const patients = await getPatientsData()
    const queryParams = req.query;

// find more advanced case of checking instead of !Object.keys
    if(!Object.keys(queryParams).length) {
        res.status(200).send(patients)
    } else {
        const handledData = await handleSearchQuery(queryParams, patients)
        res.status(200).send(handledData)
    }
}

export const getPatientById = async (req: Request<{id: Id}>, res: Response<Patient>) => {
    const patientId = req.params.id
    const patients = await getPatientsData();
    const targetPatient = await getPatientDataById(patientId, patients);

    res.status(200).send(targetPatient)
}

export const putPatient = async (req: Request<{}, any, NewPatientData>, res: Response<{message: string}>) => {
    const newPatientData = req.body;
    const patients = await getPatientsData();
    const newPatient = await createPatientData(newPatientData, patients)

    patients.push(newPatient);
    await updatePatientsData(patients);

    res.status(200).send({message: "New patient was created successfully."})
}

export const updatePatientById = async (req: Request<{id: Id}, any, NewPatientData>, res: Response<{message: string}>) => {
    const patientId = req.params.id;
    const newPatientData = req.body;
    const patients = await getPatientsData();
    const updatedPatient = await changePatientData(patientId, newPatientData, patients)

    await updatePatientsData(patients, updatedPatient)

    res.status(200).send({message: `Patient ${updatedPatient.firstName} ${updatedPatient.lastName} was updated successfully.`})
}


export const deletePatientById = async (req: Request<{id: Id}>, res: Response<{message: string}>) => {
    const patientId = req.params.id;
    const patients = await getPatientsData();
    const targetPatient = await getPatientDataById(patientId, patients);
    const updatedPatients = await deletePatientData(targetPatient, patients)

    await updatePatientsData(updatedPatients);

    res.status(200).send({message: `Patient ${targetPatient.firstName} ${targetPatient.lastName} was successfully removed`})
}


