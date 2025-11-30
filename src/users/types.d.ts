import {CreateDoctorBody, DoctorsQuery} from "../doctors/types.js";
import {CreatePatientBody, PatientsQuery} from "../patients/types.js";
import {Doctor} from "../doctors/types.js";
import {Patient} from "../patients/types.js";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
    auth: {
        email: string;
        password: string;
        refreshToken?: string;
    }
}

export type UserWithoutAuth = Omit<User, "auth">

// NOTE: old version. remove after checking
// export type UserWithoutAuth = Partial<User, "auth">

export type PublicUser = Pick<User, 'id', 'firstName', 'lastName', 'role'>

export type UsersParams = Pick<User, 'id'>

export type UsersQuery = Pick<User, 'firstName' | 'lastName'>

export interface FullUser {
    profile: UserWithoutAuth,
    roleData: Doctor | Patient | undefined
}

export type AllInfoUsersQuery =
    | DoctorsQuery & UsersQuery
    | UsersQuery

export type CreateUserData = Pick<User, 'firstName' | 'lastName' | 'role'>;

export type UpdateUserData = Partial<Pick<User, 'firstName' | 'lastName' | 'role'>>;

export type UpdateUserData = Partial<Pick<User, 'firstName' | 'lastName' | 'role'>>

export type RoleData = Doctor | Patient;

export type CreateRoleData =
    | { specialization: string } & Partial<CreateDoctorBody>
    | Partial<CreatePatientBody>;

export type UserFilter =
    | { id: string }
    | { email: string }




