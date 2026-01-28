import {Request, Response} from "express";
import {DoctorsParamsDto, DoctorWithUser, UpdateDoctorDto} from "./types.js";
import {DoctorsFlow} from "./doctors-flow";

export class DoctorsController {
    constructor(
        private readonly doctorFlow: DoctorsFlow,
    ) {
    }

    async getAll(req: Request, res: Response<DoctorWithUser[] | { message: string }>): Promise<void> {
        const filter = req.query as any;
        const doctors = await this.doctorFlow.getDoctors(filter);

        if (!doctors.length) {
            res.status(404).send({message: "Doctors not found"});
            return;
        }

        res.status(200).send(doctors);
    }

    async getById(
        req: Request<DoctorsParamsDto>,
        res: Response<DoctorWithUser | { message: string }>
    ): Promise<void> {
        const doctorId = req.params.doctorId;

        if (!doctorId) {
            res.status(400).send({message: "Missing id parameter"});
            return;
        }

        const doctor = await this.doctorFlow.getDoctorById(doctorId);

        if (!doctor) {
            res.status(404).send({message: "Doctor was not found"});
            return;
        }

        res.status(200).send(doctor);
    }

    async getMe(req: Request, res: Response<DoctorWithUser | { message: string }>): Promise<void> {
        const loggedUser = req.user!;
        const doctor = await this.doctorFlow.getDoctorById(loggedUser.id);

        if (!doctor) {
            res.status(404).send({message: "Doctor was not found"});
            return;
        }

        res.status(200).send(doctor);
    }

    async updateById(
        req: Request<DoctorsParamsDto, unknown, UpdateDoctorDto>,
        res: Response<DoctorWithUser | { message: string }>
    ): Promise<void> {
        const doctorId = req.params.doctorId;

        if (!doctorId) {
            res.status(400).send({message: "Missing id parameter"});
            return;
        }

        const updatedDoctor = await this.doctorFlow.updateDoctor(doctorId, req.body);
        res.status(200).send(updatedDoctor);
    }

    async updateMe(
        req: Request<unknown, unknown, UpdateDoctorDto>,
        res: Response<DoctorWithUser | { message: string }>
    ): Promise<void> {
        const loggedUser = req.user!;
        const updatedDoctor = await this.doctorFlow.updateDoctor(loggedUser.id, req.body);
        res.status(200).send(updatedDoctor);
    }

    async deleteMe(req: Request, res: Response<void | { message: string }>): Promise<void> {
        const loggedUser = req.user!;
        await this.doctorFlow.deleteDoctor(loggedUser.id);
        res.sendStatus(204);
    }

    deleteById = async (req: Request<DoctorsParamsDto>, res: Response<void | { message: string }>): Promise<void> => {
        const doctorId = req.params.doctorId;

        if (!doctorId) {
            res.status(400).send({message: "Missing id parameter"});
            return;
        }

        await this.doctorFlow.deleteDoctor(doctorId);
        res.sendStatus(204);
    };

}

