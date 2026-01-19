import { UserRole } from "src/users/schemas/user.schema";

export interface AuthUser{
    userId: string;
    role: UserRole;
}