import { User} from "../types.js";

export function sanitizeUsers(users: User[] ) {
    // NOTE: решил, что в данном случае оправданно использование spread. обсудить
    return users.map(u => {
        // NOTE: dangerous shallow copying
        const { auth, ...rest } = u
        return rest
    })
}
