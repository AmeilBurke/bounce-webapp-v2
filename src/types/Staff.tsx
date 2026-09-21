import type { Role } from "./Role";

export type Staff = {
    id: string;
    name: string;
    email: string;
    role: Role
    password?: string;
}