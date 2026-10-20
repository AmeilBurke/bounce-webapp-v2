import { queryOptions } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import type { Venue } from "@/types/Venue";

export const venuesQueryOptions = queryOptions({
    queryKey: ["venues"] as const,
    queryFn: async () => {
        const { data } = await axiosInstance.get<Venue[]>("/venues");
        return data;
    },
    staleTime: Infinity,
});

export const venueQueryOptions = (id: Venue["id"]) =>
    queryOptions({
        queryKey: ["venues", id] as const,
        queryFn: async () => {
            const { data } = await axiosInstance.get<Venue>(`/venues/${id}`);
            return data;
        },
        staleTime: Infinity,
    });
