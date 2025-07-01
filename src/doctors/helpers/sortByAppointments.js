export const sortByAppointments = async (doctors, order) => {
    if (!doctors) {
        throw new Error("When getting doctors something went wrong")
    } else {
        if (order === 'asc') {
            doctors.sort((doc1, doc2) => doc1.appointments.length - doc2.appointments.length)
            return doctors;

        } else if (order === 'desc') {
            doctors.sort((doc1, doc2) => doc2.appointments.length - doc1.appointments.length)
            return doctors;

        } else {
            throw new Error("the sort order is specified incorrectly")
        }
    }
}


