import {User} from "../types.js";
import {UsersService as UserService} from "../service.js"

export async function emailExists(email: string) {
    try {
        const users = await UserService.get()

        return users.some((u: User) => u.auth.email === email)
    } catch (e) {
        throw new Error(`Something went wrong with checkEmailExists function. Err: ${e}`)
    }
}