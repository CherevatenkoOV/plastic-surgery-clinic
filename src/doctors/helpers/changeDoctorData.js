import {getDoctorDataById} from "./getDoctorDataById.js";

export const changeDoctorData = async (newDoctorData, id) => {
    const targetDoctor = await getDoctorDataById(id);
    return {
        ...targetDoctor,
        ...newDoctorData
    }
}