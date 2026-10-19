import type { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import type { Ban } from "@/types/BannedPerson";
import type { UpdateBanDto } from "@/types/dto/update-ban-dto";

const updateBan = async (updateBanDto: UpdateBanDto, id: Ban["id"]): Promise<Ban> => {
    try {
        const response = await axiosInstance.patch<Ban>(`/bans/${id}`, updateBanDto);
        return response.data;
    } catch (error) {
        throw error as AxiosError;
    }
};

export default updateBan;
