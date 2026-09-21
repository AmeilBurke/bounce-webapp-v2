import { queryOptions } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import type { Alert } from "@/types/Alert";

export const alertsQueryOptions = queryOptions({
    queryKey: ["alerts"] as const,
    queryFn: async () => {
        const { data } = await axiosInstance.get<Alert[]>("/alerts");
        return data;
    },
    staleTime: Infinity,
});
