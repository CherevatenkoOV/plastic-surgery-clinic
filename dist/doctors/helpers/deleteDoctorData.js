export const deleteDoctorData = async (targetDoctor, doctors) => {
    return doctors.filter(doctor => doctor.id !== targetDoctor.id);
};
