import express, {Router} from "express";
import {changePassword, login, logout, register, requestResetPassword, resetPassword} from "./auth-controller.js";
import {authenticate} from "../shared/middleware/authenticate.js";

const router: Router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/logout', authenticate, logout)
router.post('/request-reset-password', requestResetPassword)

router.patch('/change-password', authenticate, changePassword)
router.patch('/reset-password', resetPassword)

export default router;

