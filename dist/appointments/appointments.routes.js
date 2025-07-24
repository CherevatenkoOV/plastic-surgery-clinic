import express from "express";
import { deleteAppointmensController, getAppointmentsController, putAppointmentController, updateAppointmentsController } from "./appointments.controllers.js";
const router = express.Router();
router.get('{/:id}', getAppointmentsController);
router.put('/', putAppointmentController);
router.patch('/:id', updateAppointmentsController);
router.delete('/:id', deleteAppointmensController);
export default router;
