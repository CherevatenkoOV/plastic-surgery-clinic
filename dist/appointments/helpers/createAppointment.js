import { randomUUID } from "node:crypto";
import { checkAppointTime } from "./checkAppointmentTime.js";
import { getAppointmentsData } from "./getAppointments.js";
export const createAppointmentData = async (newAppointment) => {
    const { doctorId, patientId, timeISO, procedureType } = newAppointment;
    const appointments = await getAppointmentsData();
    const isAvailable = checkAppointTime(appointments, newAppointment);
    if (!isAvailable) {
        throw new Error("Specified time to specified doctor is occupied. Try to choose another time");
    }
    else {
        const id = randomUUID();
        const createdAt = new Date().toISOString();
        const updatedAt = new Date().toISOString();
        return {
            id,
            doctorId,
            patientId,
            timeISO,
            procedureType,
            createdAt,
            updatedAt
        };
    }
};
