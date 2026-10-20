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

const DAY = 24 * 60 * 60 * 1000;

// Whole calendar days from today, in the user's own timezone
const daysFromToday = (date: string) => {
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((day.getTime() - today.getTime()) / DAY);
};

export const describeBanStart = (date: string) => {
    const days = daysFromToday(date);
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days === -1) return "Yesterday";
    return days > 1 ? `In ${days} days` : `${-days} days ago`;
};

// Bans run to the end of their last day, so this rounds to whole days
export const describeBanLength = (startDate: string, endDate: string) => {
    const days = Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / DAY);
    return days === 1 ? "1 day" : `${days} days`;
};

export const formatBanDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
