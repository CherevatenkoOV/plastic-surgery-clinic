import {Doctor, Doctors} from "../doctors.types.js";

export const deleteDoctorData = async (targetDoctor: Doctor, doctors: Doctors): Promise<Doctors> => {
    return doctors.filter(doctor => doctor.id !== targetDoctor.id)
}