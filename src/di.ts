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
import { AuthService } from "./auth/service.js";
import {AuthController} from "./auth/auth-controller.js";
import {createAuthRouter} from "./auth/auth-router.js";


const usersRepository = new UsersRepositoryFile()
const doctorsRepository = new DoctorsRepositoryFile()
const patientsRepository = new PatientsRepositoryFile()


const usersService = new UsersService(usersRepository, doctorsRepository, patientsRepository)
const doctorsService = new DoctorsService(doctorsRepository, usersService)
const patientsService = new PatientsService(patientsRepository, usersService)
const authService = new AuthService(usersService, doctorsService, patientsService)

const usersController = new UsersController(usersService)
const doctorsController = new DoctorsController(doctorsService)
const patientsController = new PatientsController(patientsService)
const authController = new AuthController(authService)

const usersRouter = createUsersRouter(usersController)
const doctorsRouter = createDoctorsRouter(doctorsController)
const patientsRouter = createPatientsRouter(patientsController)
const authRouter = createAuthRouter(authController)

export {usersRouter, doctorsRouter, patientsRouter, authRouter}