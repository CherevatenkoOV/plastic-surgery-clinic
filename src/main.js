import express from 'express'
import {doctorsRoutes} from "./doctors/index.js"
import {patientsRoutes} from "./patients/index.js";

const main = express()
const PORT = process.env.PORT

main.use(express.json())

main.use('/doctors', doctorsRoutes)
main.use('/patients', patientsRoutes)

main.listen(PORT, () => {
    console.log(`Response: ${PORT}`)
})

