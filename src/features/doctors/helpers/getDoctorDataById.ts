import {Doctor, Doctors, Id} from "../doctors.types.js";

export const getDoctorDataById = async (doctorId: Id, doctors: Doctors): Promise<Doctor> => {
        const targetDoctor = doctors.find(doctor => doctor.id === doctorId);

        if(!targetDoctor) {
            throw new Error("The doctor with the specified id was not found")
        } else {
            return targetDoctor;
        }
}