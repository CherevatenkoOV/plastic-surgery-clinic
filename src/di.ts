import {UserRepositoryLocal} from "./users/repository/user-repository-local.js";
import {UserService} from "./users/service.js";
import {UserController} from "./users/users-controller.js";
import {createUserRouter} from "./users/users-router.js";


const userRepository = new UserRepositoryLocal()
const userService = new UserService(userRepository)
const userController = new UserController(userService)
const userRouter = createUserRouter(userController)

export {userRouter}