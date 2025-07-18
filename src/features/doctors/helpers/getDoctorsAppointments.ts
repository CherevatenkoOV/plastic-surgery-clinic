import {Doctors, AllDoctorsAppointments} from "../doctors.types.js";

export const getDoctorsAppointments = async (doctors: Doctors): Promise<AllDoctorsAppointments[]> => {
    return doctors
        .filter(doctor => doctor.appointments.length)
        .map(doctor => ({
            doctorFirstName: doctor.firstName,
            doctorLastName: doctor.lastName,
            appointments: doctor.appointments
        }));
}