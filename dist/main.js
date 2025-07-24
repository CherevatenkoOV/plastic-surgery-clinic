import express from 'express';
import { doctorsRoutes } from "./doctors/index.js";
import { patientsRoutes } from "./patients/index.js";
import { errorHandler } from "./shared/middleware/errorHandler.js";
import { appointmentsRoutes } from "./appointments/index.js";
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use('/doctors', doctorsRoutes);
app.use('/patients', patientsRoutes);
app.use('/appointments', appointmentsRoutes);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Response: ${PORT}`);
});
