import { UserEntity, UserPublic } from "../users.types";

export class UserMapper {
    static toPublic(user: UserEntity): UserPublic {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
        }
    }

    static toPublicList(users: UserEntity[]): UserPublic[] {
        return users.map(this.toPublic)
    }
}