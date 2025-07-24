export const handleSearchQuery = async (queryParams, doctors) => {
    if ('firstName' in queryParams) {
        try {
            if (!queryParams.firstName) {
                return doctors;
            }
            else {
                return doctors.filter(doctor => doctor.firstName === queryParams.firstName?.trim());
            }
        }
        catch (e) {
            throw new Error("Something went wrong with searching doctor by name");
        }
    }
    else if ('lastName' in queryParams) {
        try {
            if (!queryParams.lastName) {
                return doctors;
            }
            else {
                return doctors.filter(doctor => doctor.lastName === queryParams.lastName?.trim());
            }
        }
        catch (e) {
            throw new Error("Something went wrong with searching doctor by name");
        }
    }
    else if ('specialization' in queryParams) {
        try {
            if (!queryParams.specialization) {
                return doctors;
            }
            else {
                return doctors.filter(doctor => doctor.specialization === queryParams.specialization?.trim());
            }
        }
        catch (e) {
            throw new Error("Something went wrong with searching doctor by specialization");
        }
    }
    else {
        return doctors;
    }
};
