import {checkIfAppointmentTimeIsAvailable} from "./helpers/checkIfAppointmentTimeIsAvailable.js";
import {getDoctorsData} from "./helpers/getDoctorsData.js";
import {updateDoctorsData} from "./helpers/updateDoctorsData.js";
import {doctorsConstants} from "./doctorsConstants.js";
import {createDoctor} from "./helpers/createDoctor.js";
import {changeDoctorData} from "./helpers/changeDoctorData.js";

export const getDoctors = async (req, res) => {
    const doctors = await getDoctorsData();

    if (!doctors) {
        res.status(400).send({message: doctorsConstants.errorMessages.GETTING_ALL_DOCTORS_ERROR})
    } else {
        res.status(200).send(doctors);
    }
}

export const getDoctorById = async (req, res) => {
    const id = req.params.id
    const doctors = await getDoctorsData();

    if (!doctors) {
        res.status(404).send({message: doctorsConstants.errorMessages.GETTING_ALL_DOCTORS_ERROR})
    } else {
        const targetDoctor = doctors.find(doctor => doctor.id === id)

        if (targetDoctor != null) {
            res.status(200).send(targetDoctor)
        } else {
            res.status(404).send({message: doctorsConstants.errorMessages.GETTING_DOCTOR_ERROR})
        }
    }
}

export const putDoctor = async (req, res) => {
    const newDoctorData = req.body;

    if (!newDoctorData) {
        res.status(400).send({message: doctorsConstants.errorMessages.REQUEST_BODY_OF_NEW_DOCTOR_ERROR})
    } else {
        const doctors = await getDoctorsData();

        if (!doctors) {
            res.status(404).send({message: doctorsConstants.errorMessages.GETTING_ALL_DOCTORS_ERROR})
        } else {
            const newDoctor = await createDoctor(newDoctorData)
                .catch(err => res.status(400).send({message: err.message}));

            doctors.push(newDoctor);
            await updateDoctorsData(doctors);

            res.status(200).send({message: doctorsConstants.successMessages.DOCTOR_CREATED_SUCCESSFULLY})
        }
    }
}

export const updateDoctorById = async (req, res) => {
    const newDoctorData = req.body;
    const updatedDoctor = await changeDoctorData(newDoctorData)
    const doctors = await getDoctorsData();

    if (!doctors) {
        res.status(400).send({message: doctorsConstants.errorMessages.GETTING_ALL_DOCTORS_ERROR})
    } else {
        const updatedDoctors = doctors.map(doctor => {
            if(doctor.id === newDoctorData.id) {
                return {
                    ...doctor,
                    ...updatedDoctor
                }
            }
            return doctor;
        })
        await updateDoctorsData(updatedDoctors)

        res.status(200).send({message: doctorsConstants.successMessages.DOCTOR_UPDATED_SUCCESSFULLY})
    }
}

export const deleteDoctorById = async (req, res) => {
    const id = req.params.id;
    const doctors = await getDoctorsData();

    if (!doctors) {
        res.status(400).send({message: doctorsConstants.errorMessages.GETTING_ALL_DOCTORS_ERROR})
    } else {
        const targetDoctor = doctors.find(doctor => doctor.id === id);
        if (!targetDoctor) {
            res.status(400).send({message: doctorsConstants.errorMessages.GETTING_DOCTOR_ERROR})
        } else {
            const updatedDoctors = doctors.filter(doctor => doctor.id !== id)
            await updateDoctorsData(updatedDoctors);
            //
            res.status(200).send(`Doctor ${targetDoctor.name} was successfully removed`)
        }
    }
}

export const getAppointments = async (req, res) => {
    const doctors = await getDoctorsData()

    if (!doctors) {
        res.status(404).send({message: doctorsConstants.errorMessages.GETTING_ALL_DOCTORS_ERROR})
    } else {
        const result = doctors
            .filter(doctor => doctor.appointments.length)
            .map(doctor => new Object({doctorName: doctor.name, appointments: doctor.appointments}));

        res.status(200).send(result)
    }
}

export const createAppointment = async (req, res) => {
    const doctors = await getDoctorsData()

    if (!doctors) {
        res.status(404).send({message: doctorsConstants.errorMessages.GETTING_ALL_DOCTORS_ERROR})
    } else {
        const newAppointmentInfo = req.body
        const {timeISO, patientName} = newAppointmentInfo;

        const id = req.params.id
        const targetDoctor = doctors.find(doctor => doctor.id === id)

        if (!targetDoctor) {
            res.status(400).send({message: doctorsConstants.errorMessages.GETTING_DOCTOR_ERROR})
        } else {
            if (!checkIfAppointmentTimeIsAvailable(targetDoctor, timeISO)) {
                res.status(400).send({message: doctorsConstants.errorMessages.APPOINTMENT_OCCUPIED})
            } else {
                console.log(`${targetDoctor.appointments}`)
                console.log(`${timeISO}`)
                targetDoctor.appointments.push(newAppointmentInfo)
                await updateDoctorsData(doctors)

                res.status(201).send({
                    message: `The appointment to doctor ${targetDoctor.name} was created. Patient: ${patientName}. Time: ${new Date(timeISO).toLocaleTimeString("en-US")}`
                })
            }
        }

    }
}
