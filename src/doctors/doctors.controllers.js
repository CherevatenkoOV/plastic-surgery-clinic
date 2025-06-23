import {checkIfAppointmentTimeIsAvailable} from "./helpers/checkIfAppointmentTimeIsAvailable.js";
import {getDoctorsData} from "./helpers/getDoctorsData.js";
import {updateDoctorsData} from "./helpers/updateDoctorsData.js";

export const getDoctors = async (req, res) => {
    const doctors = await getDoctorsData();

    if (!doctors) {
        res.status(400).send({message: "When getting doctors something went wrong"})
    } else {
        res.status(200).send(doctors);
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

        if (targetDoctor != null) {
            if (!checkIfAppointmentTimeIsAvailable(targetDoctor, timeISO)) {
                res.status(400).send("Specified time is occupied. Try to choose another time")
            } else {
                targetDoctor.appointments.push(newAppointmentInfo)
                updateDoctorsData(doctors)

                res.status(201).send(`
                The appointment to doctor ${targetDoctor.name} was created. 
                Patient: ${patientName}. 
                Time: ${new Date(timeISO).toLocaleTimeString("en-US")}
                `)
            }
        }
    }
}
