import {CreateDoctorBody, DoctorsQuery} from "../doctors/types.js";
import {CreatePatientBody} from "../patients/types.js";
import {Doctor} from "../doctors/types.js";
import {Patient} from "../patients/types.js";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export type PublicUser = Pick<User, 'id', 'firstName', 'lastName', 'role'>

export type UsersParams = Pick<User, 'id'>

export type UsersQuery = Pick<User, 'firstName' | 'lastName'>

export interface AllInfoUser {
    profile: User,
    roleData: Doctor | Patient | null
}

export type AllInfoUsersQuery = DoctorsQuery & UsersQuery

export type CreateUserData = Pick<User, 'firstName' | 'lastName' | 'role'>;

export type UpdateUserData = Partial<Pick<User, 'firstName' | 'lastName' | 'role'>>;

export type UpdateUserBody = Partial<Pick<User, 'firstName' | 'lastName' | 'role'>>

export type RoleData = Doctor | Patient;

export type CreateRoleData =
    | {specialization: string} & Partial<CreateDoctorBody>
    | Partial<CreatePatientBody>;


