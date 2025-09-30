import express, {Router} from "express";
import {
    login,
    logout, recoverPassword,
    register,
    registerByToken,
    resetPassword, updatePassword
} from "./auth-controller.js";
import {authenticate} from "../shared/middleware/authenticate.js";

const router: Router = express.Router();

router.post('/register/patient', register)
router.post('/register/doctor/:token', registerByToken)
router.post('/login', login)
router.post('/logout', authenticate, logout)

router.post('/reset', resetPassword) // reset
router.patch('/recover/:resetToken', recoverPassword) // recover/:resetToken

router.patch('/update-password', authenticate, updatePassword) // recover/:resetToken

export default router;

