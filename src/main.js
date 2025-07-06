import express from 'express'
import {doctorsRoutes} from "./doctors/index.js"
import {patientsRoutes} from "./patients/index.js";
import {errorHandler} from "./middleware/errorHandler.js";

const app = express()
const PORT = process.env.PORT

app.use(express.json())

app.use('/doctors', doctorsRoutes)
app.use('/patients', patientsRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Response: ${PORT}`)
})

