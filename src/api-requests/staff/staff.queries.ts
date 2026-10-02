import { queryOptions } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import type { Staff } from "@/types/Staff";

export const staffQueryOptions = queryOptions({
    queryKey: ["staff"] as const,
    queryFn: async () => {
        const { data } = await axiosInstance.get<Staff[]>("/staff");
        return data;
    },
    staleTime: Infinity,
});
