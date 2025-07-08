export const getDoctorDataById = async (doctorId, doctors) => {
        const targetDoctor = doctors.find(doctor => doctor.id === doctorId);

        if(!targetDoctor) {
            throw new Error("The doctor with the specified id was not found")
        } else {
            return targetDoctor;
        }
}