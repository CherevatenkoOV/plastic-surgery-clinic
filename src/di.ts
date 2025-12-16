import {UsersRepositoryFile} from "./users/repository/users-repository-file.js";
import {UsersService} from "./users/service.js";
import {UsersController} from "./users/users-controller.js";
import {createUsersRouter} from "./users/users-router.js";
import {DoctorsRepositoryFile} from "./doctors/repository/doctors-repository-file.js";
import {DoctorsService} from "./doctors/service.js";
import {DoctorsController} from "./doctors/doctors-controller.js";
import {createDoctorsRouter} from "./doctors/doctors-router.js";
import {PatientsRepositoryFile} from "./patients/repository/patients-repository-file.js";
import {PatientsService} from "./patients/service.js";
import {PatientsController} from "./patients/patients-controller.js";
import {createPatientsRouter} from "./patients/patients-router.js";


const usersRepository = new UsersRepositoryFile()
const usersService = new UsersService(usersRepository)
const usersController = new UsersController(usersService)
const usersRouter = createUsersRouter(usersController)

const doctorsRepository = new DoctorsRepositoryFile()
const doctorsService = new DoctorsService(doctorsRepository, usersService)
const doctorsController = new DoctorsController(doctorsService)
const doctorsRouter = createDoctorsRouter(doctorsController)

const patientsRepository = new PatientsRepositoryFile()
const patientsService = new PatientsService(patientsRepository, usersService)
const patientsController = new PatientsController(patientsService)
const patientsRouter = createPatientsRouter(patientsController)

export {usersRouter, doctorsRouter, patientsRouter}