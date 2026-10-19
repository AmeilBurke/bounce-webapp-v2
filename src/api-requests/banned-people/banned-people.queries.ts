import { queryOptions } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import type { BannedPerson } from "@/types/BannedPerson";

export const bannedPeopleQueryOptions = queryOptions({
    queryKey: ["banned-people"] as const,
    queryFn: async () => {
        const { data } = await axiosInstance.get<BannedPerson[]>("/banned-people");
        return data;
    },
    staleTime: Infinity,
});
