import { queryOptions } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import type { BannedPerson } from "@/types/BannedPerson";
import type { Venue } from "@/types/Venue";

// Only their bans at this venue are included
export const bannedPeopleAtVenueQueryOptions = (venueId: Venue["id"]) =>
    queryOptions({
        queryKey: ["banned-people", "venue", venueId] as const,
        queryFn: async () => {
            const { data } = await axiosInstance.get<BannedPerson[]>(`/banned-people/venue/${venueId}`);
            return data;
        },
        staleTime: Infinity,
    });

// People whose active bans cover every venue
export const blanketBannedPeopleQueryOptions = queryOptions({
    queryKey: ["banned-people", "blanket"] as const,
    queryFn: async () => {
        const { data } = await axiosInstance.get<BannedPerson[]>("/banned-people/blanket");
        return data;
    },
    staleTime: Infinity,
});

export const bannedPeopleNamesQueryOptions = queryOptions({
    queryKey: ["banned-people", "names"] as const,
    queryFn: async () => {
        const { data } = await axiosInstance.get<Pick<BannedPerson, "id" | "name">[]>(
            "/banned-people/names",
        );
        return data;
    },
    staleTime: Infinity,
});
