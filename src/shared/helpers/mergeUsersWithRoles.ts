
import {FullUser, RoleData, UserWithoutAuth} from "../../users/types.js";

export const mergeUsersWithRoles = (users: UserWithoutAuth[], roles: RoleData[]): FullUser[] => {
    const roleMap = new Map<string, RoleData>()
    roles.forEach(role => roleMap.set(role.userId, role))

    return users.map(user => ({
        profile: user,
        roleData: roleMap.get(user.id)
    }))
}


