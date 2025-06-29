export const patientsConstants = Object.freeze({
    paths: {
        DATA_PATH: "./src/patients/patients.json",
    },

    successMessages: {
        PATIENT_CREATED_SUCCESSFULLY: "New patient was created successful."
    },

    errorMessages: {
        GETTING_ALL_PATIENTS_ERROR: "When getting patients something went wrong",
        GETTING_PATIENT_ERROR: "The patient was not found",
        PATIENT_ALREADY_EXISTS: "The patient with the specified name already exists",
        REQUEST_BODY_OF_NEW_PATIENT_ERROR: "Something went wrong with request body of new patient.",
    }
})