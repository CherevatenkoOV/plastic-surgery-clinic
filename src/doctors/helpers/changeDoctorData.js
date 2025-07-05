import {getDoctorDataById} from "./getDoctorDataById.js";
import {getDoctorsData} from "./getDoctorsData.js";

export const changeDoctorData = async (newDoctorData, id) => {
    const doctors = await getDoctorsData()
    const targetDoctor = await getDoctorDataById(id, doctors);
    return {
        ...targetDoctor,
        ...newDoctorData
    }
}