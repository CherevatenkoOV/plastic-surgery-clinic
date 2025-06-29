import {getDoctorDataById} from "./getDoctorDataById.js";

export const changeDoctorData = async (newDoctorData) => {
    const id = newDoctorData.id;
    const targetDoctor = await getDoctorDataById(id);
    const updatedDoctor = {
        id,
    ...targetDoctor,
    ...newDoctorData
    }

    // console.log(updatedDoctor)

    return updatedDoctor
}