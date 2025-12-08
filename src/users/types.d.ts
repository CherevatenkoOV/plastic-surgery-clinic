import {CreateDoctorBody, DoctorsQueryDto} from "../doctors/types.js";
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
        email: string | undefined;
        password: string | undefined;
        refreshToken?: string;
    }
}

export type UserWithoutAuth = Omit<User, "auth">

// NOTE: old version. remove after checking
// export type UserWithoutAuth = Partial<User, "auth">


export interface UserDto {
    id: string;
    firstName: string;
    lastName: sring;
    role: string;
}

export type UsersParams = Pick<User, 'id'>

export type UsersQuery = Pick<User, 'firstName' | 'lastName'>

// NOTE: is used in mergeUserWithRole
// export interface FullUserDto {
//     profile: UserDto,
//     roleData: Doctor | Patient | undefined
// }

export type AllInfoUsersQuery =
    | DoctorsQueryDto & UsersQuery
    | UsersQuery


export interface CreateUserDto {
    firstName: string;
    lastName: string;
    role: string;
}

export interface UpdateUserDto {
    firstName?: string | undefined;
    lastName?: string | undefined;
}

// DEPRECATED
// export type RoleData = Doctor | Patient;

// DEPRECATED
// export type CreateRoleData =
//     | { specialization: string } & Partial<CreateDoctorBody>
//     | Partial<CreatePatientBody>;

export type UserFilter = Partial<Pick<User, "firstName" | "lastName">>

// DEPRECATED
// export interface UserFilter {
//     firstName?: string,
//     lastName?: string
// }


// DEPRECATED
// export type UserFilter =
//     | { id: string }
//     | { email: string }

export interface FullUserBase {
    profile: UserWithoutAuth | UserDto
}


