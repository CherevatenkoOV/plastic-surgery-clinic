import {UserEntity, UserWithoutAuth} from "../types.js";

export function sanitizeUser(user: UserEntity): UserWithoutAuth {
    const { userAuth, ...rest } = user
    return rest
}
