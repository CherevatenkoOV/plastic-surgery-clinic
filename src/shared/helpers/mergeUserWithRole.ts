// logic
// get user
// get doctor
// merge
// return

import {FullUser, RoleData,  UserWithoutAuth} from "../../users/types.js";

export const mergeUserWithRole = (user: UserWithoutAuth, role: RoleData): FullUser => {
    return {
        profile: user,
        roleData: role
    }
}