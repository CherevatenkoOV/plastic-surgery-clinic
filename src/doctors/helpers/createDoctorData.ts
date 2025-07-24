import crypto from 'node:crypto';
import {Doctor, Doctors, Id, NewDoctorData} from "../doctors.types.js";

export const createDoctorData = async (newDoctorData: NewDoctorData, doctors: Doctors): Promise<Doctor> => {

    if (!newDoctorData) {
        throw new Error("The data of new doctor is empty")
    } else {
        const {firstName, lastName, specialization} = newDoctorData;
        const doctorIsExist = !!doctors.find(doctor => (
            doctor.firstName === firstName
            &&
            doctor.lastName === lastName
        ))

        if (doctorIsExist) {
            throw new Error("The doctor with the specified name already exists")
        } else {
            let uuid = crypto.randomUUID() as Id;

            while (doctors.find(doctor => doctor.id === uuid)) {
                uuid = crypto.randomUUID() as Id;
            }

            const createdAt = new Date().toISOString();
            const updatedAt = new Date().toISOString();

            return {
                id: uuid,
                firstName,
                lastName,
                specialization,
                schedule: [],
                createdAt,
                updatedAt
            }
        }
    }

}
