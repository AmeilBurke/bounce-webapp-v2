import type { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import type { Ban, BanWithPerson } from "@/types/BannedPerson";

const approveBan = async (id: Ban["id"]): Promise<BanWithPerson> => {
    try {
        const response = await axiosInstance.patch<BanWithPerson>(`/bans/${id}/approve`);
        return response.data;
    } catch (error) {
        throw error as AxiosError;
    }
};

export default approveBan;
