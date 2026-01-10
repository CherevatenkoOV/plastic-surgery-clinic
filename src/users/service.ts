import {UpdateUserDto, UserEntity, UserFilter} from "./types.js";
import {IUsersRepository} from "./repository/i-users-repository.js";
import {Role} from "../shared/roles.js";
import {IDoctorsRepository} from "../doctors/repository/i-doctors-repository.js";
import {IPatientsRepository} from "../patients/repository/i-patients-repository.js";

export class UsersService {
    constructor(
        private readonly usersRepo: IUsersRepository,
        private readonly doctorsRepo: IDoctorsRepository,
        private readonly patientsRepo: IPatientsRepository
    ) {}

    async get(filter?: UserFilter): Promise<UserEntity[]> {
        return await this.usersRepo.find(filter)
    }

    async getById(id: string): Promise<UserEntity | null> {
        return await this.usersRepo.findById(id)
    }

    async getByEmail(email: string): Promise<UserEntity | null> {
        return await this.usersRepo.findByEmail(email)
    }

    // user creation functionality is moved to repo responsibilities
    // async create(userData: CreateUserDto): Promise<UserEntity> {
    //     return await this.usersRepo.create(userData)
    // }

    async update(id: string, userData: UpdateUserDto): Promise<UserEntity | undefined> {
       return await this.usersRepo.updateProfile(id, userData)
    }

    async delete(id: string): Promise<void> {
        const user = await this.getById(id)

        switch(user!.role) {
            case Role.DOCTOR:
                await this.doctorsRepo.delete(id)
                break

            case Role.PATIENT:
                await this.patientsRepo.delete(id)
                break
        }

        await this.usersRepo.delete(id)
    }

    async emailExists(email: string): Promise<boolean> {
        return !!(await this.getByEmail(email));
    }

    // deprecated
    // async updateCredentials(id: string, credentials: CredentialsDto): Promise<UserEntity> {
    //     return await this.usersRepo.updateCredentials(id, credentials)
    // }
}





