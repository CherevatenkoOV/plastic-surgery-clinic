import crypto from 'node:crypto';
export const createDoctorData = async (newDoctorData, doctors) => {
    if (!newDoctorData) {
        throw new Error("The data of new doctor is empty");
    }
    else {
        const { firstName, lastName, specialization } = newDoctorData;
        const doctorIsExist = !!doctors.find(doctor => (doctor.firstName === firstName
            &&
                doctor.lastName === lastName));
        if (doctorIsExist) {
            throw new Error("The doctor with the specified name already exists");
        }
        else {
            let uuid = crypto.randomUUID();
            while (doctors.find(doctor => doctor.id === uuid)) {
                uuid = crypto.randomUUID();
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
            };
        }
    }
};
