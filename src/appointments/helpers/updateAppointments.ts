import fs from "node:fs/promises";
import { Appointment, Options, WithId, Id } from "../appointments.types.js";
import { appointmentsConstants } from "../appointmentsConstants.js";

export const updateAppointments = async<T extends Appointment | Partial<Appointment> & WithId> (
    appointments: Appointment[],
    appointmentData: T,
    options: Options): Promise<Appointment[] | undefined> => {

    if (!appointments || !appointmentData) return appointments;

    const appointmentExist = checkIfExist(appointments, appointmentData.id)

    if (options?.type) {
        switch (options.type) {
            case "create":
                if (appointmentExist) return appointments;

                await updateData([...appointments, appointmentData] as Appointment[]);

                return [...appointments, appointmentData] as Appointment[]

            case "update":
                if (!appointmentExist) return appointments;

                const appointmentsAfterUpdating = appointments.map(appointment => (
                    appointment.id === appointmentData.id
                        ? { ...appointment, ...appointmentData }
                        : appointment
                ))

                await updateData(appointmentsAfterUpdating)

                return appointmentsAfterUpdating;

            case "delete":
                if(!appointmentExist) return appointments;

                const appointmentsAfterDeleting = appointments.filter(appointment => appointment.id !== appointmentData.id)

                return appointmentsAfterDeleting;

            default:
                return appointments;
        }
    }



}

function checkIfExist(appointments: Appointment[], id: Id) {
    return !!appointments.find(appointment => appointment.id === id)
}

async function updateData(appointments: Appointment[]): Promise<void> {
    const updatedData = JSON.stringify(appointments);

    await fs.writeFile(
        appointmentsConstants.paths.DATA_PATH,
        updatedData,
        { encoding: 'utf-8' },
    )

}