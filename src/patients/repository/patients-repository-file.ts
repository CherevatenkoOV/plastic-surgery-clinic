// import {CreatePatientDto, Patient, UpdatePatientDto} from "../types.js";
// import {IPatientsRepository} from "./i-patients-repository.js";
// import fs from "node:fs/promises";
// import {paths} from "../../shared/paths.js";
//
// export class PatientsRepositoryFile implements IPatientsRepository {
//
//     async find(): Promise<Patient[]> {
//         const patientsData = await fs.readFile(paths.PATIENTS, {encoding: "utf-8"})
//         return JSON.parse(patientsData)
//     }
//
//     async findById(id: string): Promise<Patient | undefined> {
//         const patients = await this.find()
//         const targetPatient = patients.find(p => p.userId === id)
//         if (!targetPatient) throw new Error("The specified patient was not found")
//
//         return targetPatient
//     }
//
//     async create(patientData: CreatePatientDto): Promise<Patient> {
//         const {userId, phone} = patientData;
//
//         const patients = await this.find();
//         if (patients.find(p => p.userId === userId)) throw new Error("Patient with specified userId already exists")
//
//         const newPatient = {
//             userId,
//             phone: phone ?? null
//         }
//
//         patients.push(newPatient)
//         await fs.writeFile(
//             paths.PATIENTS,
//             JSON.stringify(patients),
//             {encoding: 'utf-8'},
//         )
//
//         return newPatient
//     }
//
//
//     async update(userId: string, patientData: UpdatePatientDto): Promise<Patient> {
//         const patients = await this.find();
//         const targetPatient = patients.find((p: Patient) => p.userId === userId)
//         let patient: Patient;
//
//         if (!targetPatient) {
//             patient = await this.create({
//                 userId,
//                 phone: patientData.phone ?? null
//             })
//
//             return patient
//
//         } else {
//             patient = {
//                 userId,
//                 phone: patientData.phone ?? targetPatient.phone,
//             }
//
//             const index = patients.findIndex((patient: Patient) => patient.userId === userId);
//             patients[index] = patient;
//
//             await fs.writeFile(
//                 paths.PATIENTS,
//                 JSON.stringify(patients),
//                 {encoding: 'utf-8'},
//             )
//
//             return patient;
//         }
//
//
//     }
//
//     async delete(userId: string): Promise<void> {
//         const patients = await this.find();
//         const updatedPatients = patients.filter(patient => patient.userId !== userId)
//
//         await fs.writeFile(
//             paths.PATIENTS,
//             JSON.stringify(updatedPatients),
//             {encoding: 'utf-8'},
//         )
//     }
//
// }