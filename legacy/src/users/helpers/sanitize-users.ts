import { UserEntity, UserWithoutAuth} from "../types.js";

export function sanitizeUsers(users: UserEntity[]): UserWithoutAuth[] {
    // NOTE: решил, что в данном случае оправданно использование spread. обсудить
    return users.map(u => {
        // NOTE: dangerous shallow copying
        const { user_auth, ...rest } = u
        return rest
    })
}
