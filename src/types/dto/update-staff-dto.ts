import type { Role } from "../Role";


export type UpdateStaffDto = {
    name?: string;
    email?: string;
    password?: string;
    role?: Role;
}