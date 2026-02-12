import { UserEntity } from "src/users/users.types";

export class AuthMapper {
    static toAuthUser (user: UserEntity){
        return {
            id: user.id,
            role: user.role
        }
}
}