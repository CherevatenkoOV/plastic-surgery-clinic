import express from 'express'
import fs from 'fs'

const app = express()
const PORT = process.env.PORT

const dataPath = "./clinicData.json"
const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"))

const doctors = data["Doctors"]
const patients = data["Patients"]


console.log("hello")

app.get('/doctors', (req, res) => {
    res.send(doctors)
})

app.get('/doctors/:id', (req, res) => {
    const id = req.params.id
    const targetDoctor = doctors.find(patient => patient.id === id)
    res.send(targetDoctor)
})

app.get('/patients', (req, res) => {
    res.send(patients)
})

app.get('/patients/:id', (req, res) => {
    const id = req.params.id
    const targetPatient = patients.find(patient => patient.id === id)
    res.send(targetPatient)
})

app.listen(PORT, () => {
    console.log(`Response: ${PORT}`)
})
