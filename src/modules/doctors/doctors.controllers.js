import {getClinicData} from '../../utils/getClinicData.js';
import {checkIfAppointmentTimeIsAvailable} from "../../utils/checkIfAppointmentTimeIsAvailable.js";
import {updateClinicData} from "../../utils/updateClinicData.js";

const clinicData = await getClinicData()
const doctors = clinicData["Doctors"]

const getDoctors = (req, res) => {
    res.send(doctors)
    // console.log("lets go")
    // const result = doctors
    //     .filter(doctor => doctor.appointments.length > 0)
    //     .map(doctor => `${doctor.name}: ${JSON.stringify(doctor.appointments)}`)
    //     .join();
    // console.log(result)
    //
    //
    // res.send(result)
}

const getDoctorById = (req, res) => {
    const id = req.params.id
    const targetDoctor = doctors.find(doctor => doctor.id === id)
    if (targetDoctor !== 'undefined') {
        res.send(targetDoctor)
    }
}

const getAppointments = (req, res) => {
    console.log("lets go")
    const result = doctors
        .filter(doctor => doctor.appointments.length > 0)
        .map(doctor => `${doctor.name}: ${JSON.stringify(doctor.appointments)}`)
        .join();
    console.log(result)


    res.send(`{${result}}`)
}

const createAppointment = (req, res) => {
    console.log('createAppointment worked')
    const id = req.params.id
    const newAppointmentInfo = req.body
    console.log(id)
    console.log(req.body)

    const {timeISO, patientName} = newAppointmentInfo;
    const doctor = doctors.find(doctor => doctor.id === id)

    if (checkIfAppointmentTimeIsAvailable(doctor, timeISO)) {
        doctor.appointments.push(newAppointmentInfo)
    }

    updateClinicData(doctors)

    res.send(201)
}

export {
    getDoctors,
    getDoctorById,
    getAppointments,
    createAppointment
}