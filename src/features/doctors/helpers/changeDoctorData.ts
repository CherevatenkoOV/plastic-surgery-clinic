import {getDoctorDataById} from "./getDoctorDataById.js";
import {Doctor, Doctors, Id, NewDoctorData} from "./../doctors.types.ts"



export const changeDoctorData = async (doctorId: Id, newDoctorData: NewDoctorData, doctors: Doctors): Promise<Doctor> => {
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