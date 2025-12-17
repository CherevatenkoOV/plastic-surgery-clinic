import  {Router} from "express";
import {
    AuthController
} from "./auth-controller.js";
import {authenticate} from "../shared/middleware/authenticate.js";

export function createAuthRouter(authController: AuthController) {
    const router = Router()


router.post('/register/patient', authController.register)
router.post('/register/doctor/:token', authController.registerByToken)
router.post('/login', authController.login)
router.post('/logout', authenticate, authController.logout)

router.post('/reset', authController.resetPassword)
router.patch('/recover/:resetToken', authController.recoverPassword)

router.patch('/update-password', authenticate, authController.updatePassword)

return router;


}