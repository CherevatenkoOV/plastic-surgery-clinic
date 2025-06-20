import express from 'express'
import {doctorsRoutes} from "./modules/doctors/index.js"
import {patientsRoutes} from "./modules/patients/index.js";

const app = express()
const PORT = process.env.PORT

app.use(express.json())

app.use('/doctors', doctorsRoutes)
app.use('/patients', patientsRoutes)

app.listen(PORT, () => {
    console.log(`Response: ${PORT}`)
})

