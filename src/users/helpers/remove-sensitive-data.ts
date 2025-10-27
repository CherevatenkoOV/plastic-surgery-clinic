import {AllInfoUser, User, UserWithoutAuth} from "../types.js";

export async function removeSensitiveData(data: User | User[] | AllInfoUser | AllInfoUser[]): UserWithoutAuth | UserWithoutAuth[] {
    if (Array.isArray(data)) {
        const dataItem = data.find(i => i)

        if (dataItem && "profile" in dataItem) {
            return data.map((u: UserWithoutAuth) => {
                if (u.profile.auth != null) delete u.profile.auth
                return u
            })
        } else {
            return data.map((u: UserWithoutAuth) => {
                if (u.auth != null) delete u.auth
                return u
            })
        }

    } else if(typeof data === "object" && data !== null && !Array.isArray(data)) {

        if("profile" in data) {
            delete (data as UserWithoutAuth).profile.auth
        } else {
            delete (data as UserWithoutAuth).auth
        }

    } else {
        throw new Error("The data type cannot be processed.")
    }
}