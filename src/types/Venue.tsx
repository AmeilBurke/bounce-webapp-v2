import type { Staff } from "./Staff";

type VenueStaff = {
    id: string;
    staffId: Staff["id"];
    venueId: string;
    staff: Pick<Staff, "id" | "name">;
}

export type Venue = {
    id: string;
    name: string;
    imagePath: string;
    managers: VenueStaff[];
    dutyManagers: VenueStaff[];
}
