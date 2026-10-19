import type { Staff } from "./Staff";
import type { Venue } from "./Venue";

type BanVenue = {
    id: string;
    venueId: Venue["id"];
    banId: string;
    venue: Pick<Venue, "id" | "name">;
}

export type Ban = {
    id: string;
    reason: string;
    startDate: string;
    endDate: string;
    isPending: boolean;
    bannedPersonId: string;
    createdById: Staff["id"];
    createdBy: Pick<Staff, "id" | "name">;
    venueBans: BanVenue[];
}

export type BannedPerson = {
    id: string;
    name: string;
    imagePath: string;
    bans: Ban[];
}

// Bans fetched on their own come with the person they're for
export type BanWithPerson = Ban & {
    bannedPerson: Omit<BannedPerson, "bans">;
}
