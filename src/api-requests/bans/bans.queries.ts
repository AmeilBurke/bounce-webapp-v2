import { queryOptions } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import type { BanWithPerson } from "@/types/BannedPerson";

export const pendingBansQueryOptions = queryOptions({
    queryKey: ["bans", "pending"] as const,
    queryFn: async () => {
        const { data } = await axiosInstance.get<BanWithPerson[]>("/bans/pending");
        return data;
    },
    staleTime: Infinity,
});
