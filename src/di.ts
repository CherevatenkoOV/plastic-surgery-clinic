import { prisma } from "./lib/prisma";

import {
    UsersFlow,
    UsersController,
    createUsersRouter,
    UsersRepositoryPrisma,
} from "./users";

import {
    DoctorsFlow,
    DoctorsController,
    createDoctorsRouter,
    DoctorsRepositoryPrisma,
} from "./doctors";

import {
    PatientsFlow,
    PatientsController,
    createPatientsRouter,
    PatientsRepositoryPrisma,
} from "./patients";

import {
    AppointmentsFlow,
    AppointmentsController,
    createAppointmentsRouter,
    AppointmentsRepositoryPrisma,
} from "./appointments";

import {
    AuthFlow,
    AuthController,
    createAuthRouter,
    PasswordService,
    TokenService,
    MailService,
} from "./auth";

const usersRepo = new UsersRepositoryPrisma(prisma);
const doctorsRepo = new DoctorsRepositoryPrisma(prisma);
const patientsRepo = new PatientsRepositoryPrisma(prisma);
const appointmentsRepo = new AppointmentsRepositoryPrisma(prisma);

const usersFlow = new UsersFlow(prisma, usersRepo);
const doctorFlow = new DoctorsFlow(prisma, doctorsRepo, usersRepo);
const patientsFlow = new PatientsFlow(prisma, patientsRepo, usersRepo);
const appointmentsFlow = new AppointmentsFlow(prisma, appointmentsRepo, doctorsRepo, patientsRepo);

const passwordService = new PasswordService(Number(process.env.BCRYPT_SALT_ROUNDS ?? 10));

const tokenService = new TokenService(
    process.env.ACCESS_TOKEN_SECRET!,
    process.env.REFRESH_TOKEN_SECRET!,
    process.env.RESET_PASSWORD_JWT_SECRET!,
    process.env.DOCTOR_INVITE_JWT_SECRET!
);

const mailService = new MailService(
    process.env.MAIL_USER!,
    process.env.MAIL_PASS!,
    process.env.API_URL!
);

// ===== auth flow =====
const authFlow = new AuthFlow(
    passwordService,
    tokenService,
    mailService,
    usersRepo,
    doctorsRepo,
    patientsRepo,
    prisma
);

const usersController = new UsersController(usersFlow);
const doctorsController = new DoctorsController(doctorFlow);
const patientsController = new PatientsController(patientsFlow);
const appointmentsController = new AppointmentsController(appointmentsFlow);
const authController = new AuthController(authFlow);

const usersRouter = createUsersRouter(usersController);
const doctorsRouter = createDoctorsRouter(doctorsController);
const patientsRouter = createPatientsRouter(patientsController);
const appointmentsRouter = createAppointmentsRouter(appointmentsController);
const authRouter = createAuthRouter(authController);

export { usersRouter, doctorsRouter, patientsRouter, authRouter, appointmentsRouter };
