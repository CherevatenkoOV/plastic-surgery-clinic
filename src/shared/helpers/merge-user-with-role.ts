// logic
// get user
// get doctor
// merge
// return

import {UserDto, UserWithoutAuth} from "../../users/types.js";
import {Doctor, FullDoctorDto} from "../../doctors/types.js";
import {FullPatientDto, Patient} from "../../patients/types.js";

type RoleData = Doctor | Patient | undefined
type UserData = UserWithoutAuth | UserDto | undefined


export const mergeUserWithRole = (user: UserData, roleData: RoleData): FullDoctorDto | FullPatientDto => {
    if(!user || !roleData) throw new Error("Invalid argument: expected a value, but received undefined.")
    return {
        profile: user,
        roleData: roleData
    }
}