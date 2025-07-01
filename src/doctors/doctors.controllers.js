import {checkIfAppointmentTimeIsAvailable} from "./helpers/checkIfAppointmentTimeIsAvailable.js";
import {getDoctorsData} from "./helpers/getDoctorsData.js";
import {updateDoctorsData} from "./helpers/updateDoctorsData.js";
import {createDoctor} from "./helpers/createDoctor.js";
import {changeDoctorData} from "./helpers/changeDoctorData.js";
import {sortByAppointments} from "./helpers/sortByAppointments.js";

export const getDoctors = async (req, res) => {
    const doctors = await getDoctorsData();
    const sort = req.query.sort;

    if (!doctors) {
        res.status(400).send({message: "When getting doctors something went wrong"})
    } else {
        if(!sort) {
            res.status(200).send(doctors);
        } else {
            const sortedDoctors = await sortByAppointments(doctors, sort)
            res.status(200).send(sortedDoctors);
        }
    }
}

export const getDoctorById = async (req, res) => {
    const id = req.params.id
    const doctors = await getDoctorsData();

    if (!doctors) {
        res.status(404).send({message: "When getting doctors something went wrong"})
    } else {
        const targetDoctor = doctors.find(doctor => doctor.id === id)

        if (targetDoctor != null) {
            res.status(200).send(targetDoctor)
        } else {
            res.status(404).send({message: "The doctor was not found"})
        }
    }
}

export const putDoctor = async (req, res) => {
    const newDoctorData = req.body;

    if (!newDoctorData) {
        res.status(400).send({message: "Something went wrong with request body of new doctor."})
    } else {
        const doctors = await getDoctorsData();

        if (!doctors) {
            res.status(404).send({message: "When getting doctors something went wrong"})
        } else {
            const newDoctor = await createDoctor(newDoctorData)
                .catch(err => res.status(400).send({message: err.message}));

            doctors.push(newDoctor);
            await updateDoctorsData(doctors);

            res.status(200).send({message: "New doctor was created successfulyy."})
        }
    }
}

export const updateDoctorById = async (req, res) => {
    const id = req.params.id;
    const newDoctorData = req.body;
    const updatedDoctor = await changeDoctorData(newDoctorData, id)
    const doctors = await getDoctorsData();

    if (!doctors) {
        res.status(400).send({message: "When getting doctors something went wrong"})
    } else {
        const updatedDoctors = doctors.map(doctor => {
            if(doctor.id === id) {
                return {
                    ...doctor,
                    ...updatedDoctor
                }
            }
            return doctor;
        })
        await updateDoctorsData(updatedDoctors)

        res.status(200).send({message:"Doctor was updated successfuly."})
    }
}

export const deleteDoctorById = async (req, res) => {
    const id = req.params.id;
    const doctors = await getDoctorsData();

    if (!doctors) {
        res.status(400).send({message: "When getting doctors something went wrong"})
    } else {
        const targetDoctor = doctors.find(doctor => doctor.id === id);
        if (!targetDoctor) {
            // БЫЛО:
            // res.status(200).send({message: "Doctor was deleted successfuly."})
            // СТАЛО:
            res.status(200).send({message: "Doctor was deleted successfuly."})
        } else {
            const updatedDoctors = doctors.filter(doctor => doctor.id !== id)
            await updateDoctorsData(updatedDoctors);
            res.status(200).send({messages: "Doctor was deleted successfuly."})
        }
    }
}

export const getAppointments = async (req, res) => {
    const doctors = await getDoctorsData()

    if (!doctors) {
        res.status(404).send({message: "When getting doctors something went wrong"})
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
        res.status(404).send({message: "When getting doctors something went wrong"})
    } else {
        const newAppointmentInfo = req.body
        const {timeISO, patientName} = newAppointmentInfo;

        const id = req.params.id
        const targetDoctor = doctors.find(doctor => doctor.id === id)

        if (!targetDoctor) {
            res.status(400).send({message: "The doctor was not found"})
        } else {
            if (!checkIfAppointmentTimeIsAvailable(targetDoctor, timeISO)) {
                res.status(400).send({message: "Specified time is occupied. Try to choose another time"})
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
