export const sortByAppointments = async (doctors, sortOrder) => {
    if(!sortOrder) {
        throw new Error("The sort order was not specified")
    } else {
        if (sortOrder === 'asc') {
            doctors.sort((doc1, doc2) => doc1.appointments.length - doc2.appointments.length)
            return doctors;

        } else if (sortOrder === 'desc') {
            doctors.sort((doc1, doc2) => doc2.appointments.length - doc1.appointments.length)
            return doctors;

        } else {
            throw new Error("The sort order is specified incorrectly")
        }
    }

}


