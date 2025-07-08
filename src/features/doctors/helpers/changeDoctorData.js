import {getDoctorDataById} from "./getDoctorDataById.js";

export const changeDoctorData = async (doctorId, newDoctorData, doctors) => {
    if(!newDoctorData) {
        throw new Error("New doctor's data is empty")
    } else {
        const targetDoctor = await getDoctorDataById(doctorId, doctors);
        return {
            ...targetDoctor,
            ...newDoctorData
        }
    }


}