import {getDoctorsData} from "./helpers/getDoctorsData.js";
import {updateDoctorsData} from "./helpers/updateDoctorsData.js";
import {createDoctorData} from "./helpers/createDoctorData.js";
import {changeDoctorData} from "./helpers/changeDoctorData.js";
import {getDoctorDataById} from "./helpers/getDoctorDataById.js";
import {deleteDoctorData} from "./helpers/deleteDoctorData.js";
import {handleSearchQuery} from "./helpers/handleSearchQuery.js";
import {Request, Response} from "express";
import { Doctor, Doctors, DoctorsQuery, Id, NewDoctorData} from "./doctors.types.js";


export const getDoctors= async (req: Request<{}, any, any, DoctorsQuery>, res: Response<Doctors | Doctor>) => {
    const doctors = await getDoctorsData();
    const queryParams = req.query;

    if (!Object.keys(queryParams).length) {
        res.status(200).send(doctors);
    } else {
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

