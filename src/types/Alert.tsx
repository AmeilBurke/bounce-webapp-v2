import type { Staff } from "./Staff";

export type Alert = {
    id: string;
    imagePath: string;
    reason: string;
    startDate: Date;
    createdById: string;
    personId: Staff["id"] | null;
}