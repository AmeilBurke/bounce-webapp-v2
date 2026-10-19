import type { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import type { Ban } from "@/types/BannedPerson";

const deleteBan = async (id: Ban["id"]): Promise<string> => {
    try {
        const response = await axiosInstance.delete<string>(`/bans/${id}`);
        return response.data;
    } catch (error) {
        throw error as AxiosError;
    }
};

export default deleteBan;
