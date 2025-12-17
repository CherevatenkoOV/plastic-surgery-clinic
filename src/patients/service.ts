import {Request} from "express";
import {
    CreatePatientDto,
    FullPatientDto,
    FullPatientFilter,
    Patient,
    UpdatePatientDto
} from "./types.js";
import {UsersService as UserService} from "../users/service.js"
import {Appointment} from "../appointments/types.js";
import {ServiceHelper as AppointmentServiceHelper} from "../appointments/service.js";
import {mergeUsersWithRoles} from "../shared/helpers/merge-users-with-roles.js";
import {mergeUserWithRole} from "../shared/helpers/merge-user-with-role.js";
import {IPatientsRepository} from "./repository/i-patients-repository.js";

// NOTE: done
export class PatientsService {
    constructor(
        private readonly patientsRepo: IPatientsRepository,
        private readonly usersService: UserService
    ) {
    }

    async create(patientData: CreatePatientDto): Promise<Patient> {
        return await this.patientsRepo.create(patientData)
    }

    async get(filter?: FullPatientFilter): Promise<FullPatientDto[]> {
        const {firstName, lastName} = filter ?? {}

        const patients = await this.patientsRepo.find()
        const users = await this.usersService.get({firstName, lastName})

        return mergeUsersWithRoles(users, patients)

    }

    // NOTE: done
    async getById(userId: string): Promise<FullPatientDto | undefined> {
        const patient = await this.patientsRepo.findById(userId)
        const user = await this.usersService.getById(userId)
        return mergeUserWithRole(user, patient)
    }

    // NOTE: done
    async update(id: string, patientData: UpdatePatientDto): Promise<FullPatientDto> {
        const {firstName, lastName, phone} = patientData
        const updatedUser = await this.usersService.update(id, {firstName, lastName})
        const updatedPatient = await this.patientsRepo.update(id, {phone})

        return mergeUserWithRole(updatedUser, updatedPatient)
    }

    // NOTE: done
    async delete(id: string): Promise<void> {
        await this.patientsRepo.delete(id)
        await this.usersService.delete(id)
    }

    async getAppointments(req: Request): Promise<Appointment[] | undefined> {
        const loggedUser = req.user!;
        return await AppointmentServiceHelper.getAppointmentsData({patientId: loggedUser.id})
    }

}

