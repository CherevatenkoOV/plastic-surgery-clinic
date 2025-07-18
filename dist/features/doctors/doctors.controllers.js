import { getDoctorsData } from "./helpers/getDoctorsData.js";
import { updateDoctorsData } from "./helpers/updateDoctorsData.js";
import { createDoctorData } from "./helpers/createDoctorData.js";
import { changeDoctorData } from "./helpers/changeDoctorData.js";
import { sortByAppointments } from "./helpers/sortByAppointments.js";
import { createDoctorAppointment } from "./helpers/createDoctorAppointment.js";
import { getDoctorDataById } from "./helpers/getDoctorDataById.js";
import { deleteDoctorData } from "./helpers/deleteDoctorData.js";
import { getDoctorsAppointments } from "./helpers/getDoctorsAppointments.js";
import { handleSearchQuery } from "./helpers/handleSearchQuery.js";
export const getDoctors = async (req, res) => {
    const doctors = await getDoctorsData();
    const queryParams = req.query;
    if (!Object.keys(queryParams).length) {
        return res.status(200).send(doctors);
    }
    else {
        const handledData = await handleSearchQuery(queryParams, doctors);
        return res.status(200).send(handledData);
    }
};
export const getDoctorById = async (req, res) => {
    const doctorId = req.params.id;
    const doctors = await getDoctorsData();
    const targetDoctor = await getDoctorDataById(doctorId, doctors);
    return res.status(200).send(targetDoctor);
};
export const putDoctor = async (req, res) => {
    const newDoctorData = req.body;
    const doctors = await getDoctorsData();
    const newDoctor = await createDoctorData(newDoctorData, doctors);
    doctors.push(newDoctor);
    await updateDoctorsData(doctors);
    return res.status(200).send({ message: "New doctor was created successfully." });
};
export const updateDoctorById = async (req, res) => {
    const doctorId = req.params.id;
    const newDoctorData = req.body;
    const doctors = await getDoctorsData();
    const updatedDoctor = await changeDoctorData(doctorId, newDoctorData, doctors);
    await updateDoctorsData(doctors, updatedDoctor);
    return res.status(200).send({ message: `Doctor ${updatedDoctor.firstName} ${updatedDoctor.lastName} was updated successfully.` });
};
export const deleteDoctorById = async (req, res) => {
    const doctorId = req.params.id;
    const doctors = await getDoctorsData();
    const targetDoctor = await getDoctorDataById(doctorId, doctors);
    const updatedDoctors = await deleteDoctorData(targetDoctor, doctors);
    await updateDoctorsData(updatedDoctors);
    return res.status(200).send({ messages: "Doctor was deleted successfuly." });
};
export const getAppointments = async (req, res) => {
    const doctorId = req.query.id;
    const doctors = await getDoctorsData();
    if (!doctorId) {
        const allDoctorsAppointments = await getDoctorsAppointments(doctors);
        return res.status(200).send(allDoctorsAppointments);
    }
    else {
        const targetDoctor = await getDoctorDataById(doctorId, doctors);
        return res.status(200).send(targetDoctor.appointments);
    }
};
export const createAppointment = async (req, res) => {
    const doctorId = req.params.id;
    const newAppointmentInfo = req.body;
    const doctors = await getDoctorsData();
    const targetDoctor = await getDoctorDataById(doctorId, doctors);
    const updatedDoctor = await createDoctorAppointment(targetDoctor, newAppointmentInfo);
    await updateDoctorsData(doctors, updatedDoctor);
    res.status(201).send({
        message: `The appointment to doctor ${targetDoctor.firstName} ${targeDoctor.lastName} was created. Patient: ${newAppointmentInfo.patientName}. Time: ${newAppointmentInfo.timeISO}`
    });
};
