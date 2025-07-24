import fs from "node:fs/promises";
import { appointmentsConstants } from "../appointmentsConstants.js";
export const updateAppointments = async (appointments, appointmentData, options) => {
    if (!appointments || !appointmentData)
        return appointments;
    const appointmentExist = checkIfExist(appointments, appointmentData.id);
    if (options?.type) {
        switch (options.type) {
            case "create":
                if (appointmentExist)
                    return appointments;
                await updateData([...appointments, appointmentData]);
                return [...appointments, appointmentData];
            case "update":
                if (!appointmentExist)
                    return appointments;
                const appointmentsAfterUpdating = appointments.map(appointment => (appointment.id === appointmentData.id
                    ? { ...appointment, ...appointmentData }
                    : appointment));
                await updateData(appointmentsAfterUpdating);
                return appointmentsAfterUpdating;
            case "delete":
                if (!appointmentExist)
                    return appointments;
                const appointmentsAfterDeleting = appointments.filter(appointment => appointment.id !== appointmentData.id);
                return appointmentsAfterDeleting;
            default:
                return appointments;
        }
    }
};
function checkIfExist(appointments, id) {
    return !!appointments.find(appointment => appointment.id === id);
}
async function updateData(appointments) {
    const updatedData = JSON.stringify(appointments);
    await fs.writeFile(appointmentsConstants.paths.DATA_PATH, updatedData, { encoding: 'utf-8' });
}
