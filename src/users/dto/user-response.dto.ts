import { UserRole } from "src/generated/prisma/enums";

export class UserResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}