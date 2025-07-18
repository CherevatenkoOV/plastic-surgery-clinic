// @ts-nocheck
import {sortByAppointments} from "./sortByAppointments.js";

export const handleSearchQuery = async (queryParams, doctors) => {
    if ('sortOrder' in queryParams) {
        try {
            return await sortByAppointments(queryParams.sortOrder, doctors);
        } catch (e) {
            throw new Error("Something went wrong while sorting doctors")
        }
    } else if ('firstName' in queryParams) {
        try {
            return doctors.filter(doctor => doctor.firstName === queryParams.firstName.trim())
        } catch (e) {
            throw new Error("Something went wrong with searching doctor by name")
        }
    } else if ('lastName' in queryParams) {
        try {
            return doctors.filter(doctor => doctor.lastName === queryParams.lastName.trim())
        } catch (e) {
            throw new Error("Something went wrong with searching doctor by name")
        }
    } else if ('specialization' in queryParams) {
        try {
            return doctors.filter(doctor => doctor.specialization === queryParams.specialization.trim())
        } catch (e) {
            throw new Error("Something went wrong with searching doctor by specialization")
        }
    }
}