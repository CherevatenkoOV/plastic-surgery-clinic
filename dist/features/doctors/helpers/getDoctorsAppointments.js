export const getDoctorsAppointments = async (doctors) => {
    return doctors
        .filter(doctor => doctor.appointments.length)
        .map(doctor => new Object({ doctorFirstName: doctor.firstName, doctorLastName: doctor.lastName, appointments: doctor.appointments }));
};
