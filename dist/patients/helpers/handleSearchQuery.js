export const handleSearchQuery = async (queryParams, patients) => {
    if ('firstName' in queryParams) {
        try {
            return patients.filter(patient => patient.firstName === queryParams.firstName?.trim());
        }
        catch (e) {
            throw new Error("Something went wrong with searching patient by first name");
        }
    }
    else if ('lastName' in queryParams) {
        try {
            return patients.filter(patient => patient.lastName === queryParams.lastName?.trim());
        }
        catch (e) {
            throw new Error("Something went wrong with searching patient by last name");
        }
    }
    else {
        return patients;
    }
};
