import {checkIfAppointmentTimeIsAvailable} from "./checkIfAppointmentTimeIsAvailable.js";

export function makeAppointment({doctorId, newAppointmentInfo, clinicData}) {
  const {newAppointmentTimeISO, patientName} = newAppointmentInfo;
  const doctor = clinicData["Doctors"].find(doctor => doctor.id === doctorId);
  console.log(doctor["appointments"])


  if(checkIfAppointmentTimeIsAvailable(doctor, newAppointmentTimeISO)) {
    doctor.appointments.push(newAppointmentInfo)
  }

  // const newAppointment = {
  // timeISO: ,
  // patientName:
  // }

  // JSON format
  // {
  //   "newAppointment": {
  //   "timeISO": "2025-07-03T09:00:00",
  //       "patientName": "Alessia Ferri"
  // }
  // }

}