import express from 'express'
import {doctorsRoutes} from "./doctors/index.js"
import {patientsRoutes} from "./patients/index.js";

const index = express()
const PORT = process.env.PORT

index.use(express.json())

index.use('/doctors', doctorsRoutes)
index.use('/patients', patientsRoutes)

index.listen(PORT, () => {
    console.log(`Response: ${PORT}`)
})

