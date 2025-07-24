import { Doctor, Doctors, DoctorsQuery } from "../doctors.types.js";

export const handleSearchQuery = async (queryParams: DoctorsQuery, doctors: Doctors): Promise<Doctor | Doctors> => {
    // TODO refactor the way of filtering
    // if ('sortOrder' in queryParams) {
    //     try {
    //         return await sortByAppointments(queryParams.sortOrder, doctors);
    //     } catch (e) {
    //         throw new Error("Something went wrong while sorting doctors")
    //     }
    // } 

    if ('firstName' in queryParams) {
        try {
            if (!queryParams.firstName) {
                return doctors;
            } else {
                return doctors.filter(doctor => doctor.firstName === queryParams.firstName?.trim())
            }

        } catch (e) {
            throw new Error("Something went wrong with searching doctor by name")
        }

    } else if ('lastName' in queryParams) {
        try {
            if (!queryParams.lastName) {
                return doctors;
            } else {
                return doctors.filter(doctor => doctor.lastName === queryParams.lastName?.trim())
            }
        } catch (e) {
            throw new Error("Something went wrong with searching doctor by name")
        }

    } else if ('specialization' in queryParams) {
        try {
            if (!queryParams.specialization) {
                return doctors;
            } else {
                return doctors.filter(doctor => doctor.specialization === queryParams.specialization?.trim())
            }

        } catch (e) {
            throw new Error("Something went wrong with searching doctor by specialization")
        }
    } else {
        return doctors;
    }
}