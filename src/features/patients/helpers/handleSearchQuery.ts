
// TODO
// function has to be refactored

import {Patient, Patients, PatientsQuery} from "../patients.types.js";

export const handleSearchQuery = async (queryParams: PatientsQuery, patients: Patients): Promise<Patient | Patients | undefined> => {
    if ('firstName' in queryParams) {
        try {
            return patients.filter(patient => queryParams.firstName && patient.firstName === queryParams.firstName.trim())
        } catch (e) {
            throw new Error("Something went wrong with searching patient by first name")
        }
    } else if ('lastName' in queryParams) {
        try {
            return patients.filter(patient => queryParams.lastName && patient.lastName === queryParams.lastName.trim())
        } catch (e) {
            throw new Error("Something went wrong with searching patient by last name")
        }
    } else {
        return patients;
    }
}