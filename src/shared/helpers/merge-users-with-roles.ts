import {UserDto, UserWithoutAuth} from "../../users/types.js";
import {FullDoctorDto, Doctor} from "../../doctors/types.js";
import {FullPatientDto, Patient} from "../../patients/types.js";

type RoleData = Doctor | Patient | undefined
type UserData = UserWithoutAuth | UserDto | undefined

export const mergeUsersWithRoles = (users: UserData[], rolesData: RoleData[]): FullDoctorDto[] | FullPatientDto[] => {
    if (!users || !rolesData) throw new Error("Invalid argument: expected a value, but received undefined.")

    const roleMap = new Map<string, RoleData>()

    rolesData.forEach((role: RoleData) => {
            if (!role?.userId) throw new Error("Role details were not found")
            roleMap.set(role.userId, role)
        }
    )

    return users.map((user: UserData) => {
        if (!user) throw new Error("User is undefined")
        return {
            profile: user,
            roleData: roleMap.get(user.id)
        }
    })
}


