import type { Ban } from "@/types/BannedPerson";
import { Role } from "@/types/Role";
import type { Staff } from "@/types/Staff";
import type { Venue } from "@/types/Venue";

export const managedVenueIds = (user: Staff | undefined, venues: Venue[] | undefined) =>
    new Set(
        (venues ?? [])
            .filter((venue) => venue.managers.some((m) => m.staffId === user?.id))
            .map((venue) => venue.id),
    );

// Mirrors the backend: admins can edit any ban, venue managers only bans limited to venues they manage
export const canManageBan = (ban: Ban, user: Staff | undefined, managed: Set<Venue["id"]>) => {
    if (user?.role === Role.ADMIN) return true;
    if (user?.role !== Role.VENUE_MANAGER) return false;
    return ban.venueBans.every((venueBan) => managed.has(venueBan.venueId));
};

export const isBanActive = (ban: Ban, now = new Date()) =>
    !ban.isPending && new Date(ban.startDate) <= now && now < new Date(ban.endDate);

// True when the person's active bans, taken together, cover every venue
export const hasBlanketBan = (bans: Ban[], venueIds: Venue["id"][], now = new Date()) => {
    if (venueIds.length === 0) return false;

    const covered = new Set(
        bans
            .filter((ban) => isBanActive(ban, now))
            .flatMap((ban) => ban.venueBans.map((venueBan) => venueBan.venueId)),
    );
    return venueIds.every((venueId) => covered.has(venueId));
};

export const isBanAtVenue =(ban: Ban, venueId: Venue["id"]) =>
    ban.venueBans.some((venueBan) => venueBan.venueId === venueId);

// Date inputs work in YYYY-MM-DD, read as a day in the user's own timezone
const parseDateInput = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
};

export const toDateInputValue = (date: Date) =>
    [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");

export const startOfDayIso = (value: string) => parseDateInput(value).toISOString();

// The ban covers the whole of its end date
export const endOfDayIso = (value: string) => {
    const date = parseDateInput(value);
    date.setHours(23, 59, 59, 999);
    return date.toISOString();
};

export const formatBanDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
