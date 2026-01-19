import {Router} from "express";
import {
    AuthController
} from "./auth-controller.js";
import {authenticate} from "../shared/middleware/authenticate.js";

export function createAuthRouter(authController: AuthController) {
    const router = Router()

    router.post('/register/patient', authController.registerPatient)
    router.post("/invite/doctor", authenticate, authController.inviteDoctor);
    router.post('/register/doctor/:token', authController.registerDoctor)

    router.post('/login', authController.login)
    router.post('/logout', authenticate, authController.logout)

    router.post('/password/reset', authController.resetPassword)
    router.post('/password/recover/:resetToken', authController.recoverPassword)

    router.patch('/password/update', authenticate, authController.updatePassword)

    return router;
}