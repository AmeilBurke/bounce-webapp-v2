import type { Role } from "../Role";


export type CreateStaffDto = {
    name: string;
    email: string;
    password: string;
    role: Role;
}