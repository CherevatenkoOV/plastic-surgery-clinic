import express, {Application} from 'express'
import {doctorsRoutes} from "./features/doctors/index.ts"
import {patientsRoutes} from "./features/patients/index.ts";
import {errorHandler} from "./shared/middleware/errorHandler.ts";

const app: Application = express()
const PORT = process.env.PORT

app.use(express.json())

app.use('/doctors', doctorsRoutes)
app.use('/patients', patientsRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Response: ${PORT}`)
})

