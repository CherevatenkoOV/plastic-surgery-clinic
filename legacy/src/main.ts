import express, {Application} from 'express'
import {errorHandler} from "./shared/middleware/error-handler.js";
import {doctorsRouter, usersRouter, patientsRouter, authRouter, appointmentsRouter} from "./di.js";

const app: Application = express()
const PORT = process.env.PORT

app.use(express.json())

app.use('/doctors', doctorsRouter)
app.use('/patients', patientsRouter)
app.use('/appointments', appointmentsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Response: ${PORT}`)
})


