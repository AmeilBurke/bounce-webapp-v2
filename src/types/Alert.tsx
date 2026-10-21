import type { Staff } from "./Staff";

export type Alert = {
    id: string;
    imagePath: string;
    reason: string;
    // ISO string, as it arrives in the JSON
    startDate: string;
    createdById: string;
    personId: Staff["id"] | null;
}