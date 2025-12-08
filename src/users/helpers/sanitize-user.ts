import {User, UserWithoutAuth} from "../types.js";

export function sanitizeUser(user: User): UserWithoutAuth {
    const { auth, ...rest } = user
    return rest
}
