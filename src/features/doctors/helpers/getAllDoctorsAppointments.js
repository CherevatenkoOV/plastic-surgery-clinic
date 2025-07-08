export const getAllDoctorsAppointments = async (doctors) => {
    return doctors
        .filter(doctor => doctor.appointments.length)
        .map(doctor => new Object({doctorName: doctor.name, appointments: doctor.appointments}));
}