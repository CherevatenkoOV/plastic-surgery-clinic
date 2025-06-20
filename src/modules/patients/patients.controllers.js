import { getClinicData } from '../../utils/getClinicData.js';

const clinicData = await getClinicData()
const patients = clinicData["Patients"]

const getPatients = (req, res) => {
    res.send(patients)
}

const getPatientById =  (req, res) => {
    const id = req.params.id
    const targetPatient = patients.find(patient => patient.id === id)
    if(targetPatient !== 'undefined') {
        res.send(targetPatient)
    }
}

export {
    getPatients,
    getPatientById
}