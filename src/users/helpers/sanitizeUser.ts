import {User} from "../types.js";

export function sanitizeUser(user: User) {
    const { auth, ...rest } = user
    return rest
}
