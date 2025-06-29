export const doctorsConstants = Object.freeze({
    paths: {
        DATA_PATH: "./src/doctors/doctors.json",
    },

    successMessages: {
        DOCTOR_CREATED_SUCCESSFULLY: "New doctor was created successful.",
        DOCTOR_UPDATED_SUCCESSFULLY: "Doctor was updated successful."
    },

    errorMessages: {
        GETTING_ALL_DOCTORS_ERROR: "When getting doctors something went wrong",
        GETTING_DOCTOR_ERROR: "The doctor was not found",
        APPOINTMENT_OCCUPIED: "Specified time is occupied. Try to choose another time",
        REQUEST_BODY_OF_NEW_DOCTOR_ERROR: "Something went wrong with request body of new doctor.",
        DOCTOR_ALREADY_EXISTS: "The doctor with the specified name already exists",
        DOCTOR_NOT_FOUND: "The doctor with the specified id was not found",
    },

})