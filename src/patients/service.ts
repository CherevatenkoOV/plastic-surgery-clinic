import {Request} from "express";
import {
    CreatePatientDto,
    FullPatientDto,
    FullPatientFilter,
    Patient,
    UpdatePatientDto
} from "./types.js";
import {Appointment} from "../appointments/types.js";
import {mergeUsersWithRoles} from "../shared/helpers/merge-users-with-roles.js";
import {mergeUserWithRole} from "../shared/helpers/merge-user-with-role.js";
import {IPatientsRepository} from "./repository/i-patients-repository.js";
import {IUsersRepository} from "../users/repository/i-users-repository.js";
import {IAppointmentsRepository} from "../appointments/repository/i-appointments-repository.js";

// NOTE: done
export class PatientsService {
    constructor(
        private readonly patientsRepo: IPatientsRepository,
        private readonly usersRepo: IUsersRepository,
        private readonly appointmentsRepo: IAppointmentsRepository
    ) {
    }

    async create(patientData: CreatePatientDto): Promise<Patient> {
        return await this.patientsRepo.create(patientData)
    }

    async get(filter?: FullPatientFilter): Promise<FullPatientDto[]> {
        const {firstName, lastName} = filter ?? {}

        const patients = await this.patientsRepo.find()
        const users = await this.usersRepo.find({firstName, lastName})

        return mergeUsersWithRoles(users, patients)

    }

    // NOTE: done
    async getById(userId: string): Promise<FullPatientDto | undefined> {
        const patient = await this.patientsRepo.findById(userId)
        const user = await this.usersRepo.findById(userId)
        return mergeUserWithRole(user, patient)
    }

    // NOTE: done
    async update(id: string, patientData: UpdatePatientDto): Promise<FullPatientDto> {
        const {firstName, lastName, phone} = patientData
        const updatedUser = await this.usersRepo.updateProfile(id, {firstName, lastName})
        const updatedPatient = await this.patientsRepo.update(id, {phone})

        return mergeUserWithRole(updatedUser, updatedPatient)
    }

    // NOTE: done
    async delete(id: string): Promise<void> {
        await this.patientsRepo.delete(id)
        await this.usersRepo.delete(id)
    }

    async getAppointments(req: Request): Promise<Appointment[] | undefined> {
        const loggedUser = req.user!;
        return await this.appointmentsRepo.find({patientId: loggedUser.id})
    }
}

