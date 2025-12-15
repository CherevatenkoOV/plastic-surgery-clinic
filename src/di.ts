import {UsersRepositoryLocal} from "./users/repository/users-repository-local.js";
import {UsersService} from "./users/service.js";
import {UsersController} from "./users/users-controller.js";
import {createUsersRouter} from "./users/users-router.js";
import {DoctorsRepositoryLocal} from "./doctors/repository/doctors-repository-local.js";
import {DoctorsService} from "./doctors/service.js";
import {DoctorsController} from "./doctors/doctors-controller.js";
import {createDoctorsRouter} from "./doctors/doctors-router.js";


const usersRepository = new UsersRepositoryLocal()
const usersService = new UsersService(usersRepository)
const usersController = new UsersController(usersService)
const usersRouter = createUsersRouter(usersController)

const doctorsRepository = new DoctorsRepositoryLocal()
const doctorsService = new DoctorsService(doctorsRepository, usersService)
const doctorsController = new DoctorsController(doctorsService)
const doctorsRouter = createDoctorsRouter(doctorsController)

export {usersRouter, doctorsRouter}