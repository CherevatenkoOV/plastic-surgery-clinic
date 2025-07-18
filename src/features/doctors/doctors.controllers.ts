import {getDoctorsData} from "./helpers/getDoctorsData.js";
import {updateDoctorsData} from "./helpers/updateDoctorsData.js";
import {createDoctorData} from "./helpers/createDoctorData.js";
import {changeDoctorData} from "./helpers/changeDoctorData.js";
import {createDoctorAppointment} from "./helpers/createDoctorAppointment.js";
import {getDoctorDataById} from "./helpers/getDoctorDataById.js";
import {deleteDoctorData} from "./helpers/deleteDoctorData.js";
import {getDoctorsAppointments} from "./helpers/getDoctorsAppointments.js";
import {handleSearchQuery} from "./helpers/handleSearchQuery.js";
import {Request, Response} from "express";
import {AppointmentsItem, Doctor, Doctors, DoctorsQuery, Id, NewDoctorData} from "./doctors.types.js";


export const getDoctors= async (req: Request<{}, any, any, DoctorsQuery>, res: Response<Doctors | Doctor>) => {
    const doctors = await getDoctorsData();
    const queryParams = req.query;

    if (!Object.keys(queryParams).length) {
        res.status(200).send(doctors);
    } else {
        // @ts-ignore
        const handledData = await handleSearchQuery(queryParams, doctors);
        res.status(200).send(handledData)
    }
}

export const getDoctorById= async (req: Request<{id: Id}, any>, res: Response<Doctor>) => {
    const doctorId = req.params.id;
    const doctors = await getDoctorsData();
    const targetDoctor= await getDoctorDataById(doctorId, doctors);

    res.status(200).send(targetDoctor)
}

export const putDoctor = async (req: Request<{}, any, NewDoctorData>, res: Response<{message: string}>) => {
    const newDoctorData = req.body;
    const doctors = await getDoctorsData();
    const newDoctor = await createDoctorData(newDoctorData, doctors)

    doctors.push(newDoctor);
    await updateDoctorsData(doctors);

    res.status(200).send({message: "New doctor was created successfully."})
}

export const updateDoctorById = async (req: Request<{id: Id}, any, NewDoctorData>, res: Response<{message: string}>) => {
    const doctorId = req.params.id;
    const newDoctorData = req.body;
    const doctors = await getDoctorsData();
    const updatedDoctor = await changeDoctorData(doctorId, newDoctorData, doctors)

    await updateDoctorsData(doctors, updatedDoctor)

    res.status(200).send({message: `Doctor ${updatedDoctor.firstName} ${updatedDoctor.lastName} was updated successfully.`})
}

export const deleteDoctorById = async (req: Request<{id: Id}>, res: Response<{message: string}>) => {
    const doctorId: Id = req.params.id;
    const doctors = await getDoctorsData();

    const targetDoctor = await getDoctorDataById(doctorId, doctors);
    const updatedDoctors = await deleteDoctorData(targetDoctor, doctors);

    await updateDoctorsData(updatedDoctors);

    res.status(200).send({message: "Doctor was deleted successfully."})
}

// should refactor this controller based on the feedback
export const getAppointments = async (req: Request<{}, any, any, {id: Id}>, res: Response) => {
    const doctorId: Id = req.query.id;
    const doctors = await getDoctorsData()
    if (!doctorId) {
        const allDoctorsAppointments = await getDoctorsAppointments(doctors)
        res.status(200).send(allDoctorsAppointments)
    } else {
        const targetDoctor = await getDoctorDataById(doctorId, doctors)
        res.status(200).send(targetDoctor.appointments)
    }
}

export const createAppointment = async (req: Request<{id: Id}, any, AppointmentsItem>, res: Response<{message: string}>) => {
    const doctorId = req.params.id
    const newAppointmentInfo = req.body
    const doctors = await getDoctorsData();
    const targetDoctor = await getDoctorDataById(doctorId, doctors)
    const updatedDoctor = await createDoctorAppointment(targetDoctor, newAppointmentInfo)

    await updateDoctorsData(doctors, updatedDoctor)

    res.status(201).send({
        message: `The appointment to doctor ${targetDoctor.firstName} ${targetDoctor.lastName} was created. Patient: ${newAppointmentInfo.patientFirstName} ${newAppointmentInfo.patientLastName}. Time: ${newAppointmentInfo.timeISO}`
    })

}
