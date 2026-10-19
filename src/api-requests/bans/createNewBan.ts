import type { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import type { CreateBanDto } from "@/types/dto/create-ban-dto";
import type { Ban } from "@/types/BannedPerson";

const createNewBan = async (createBanDto: CreateBanDto): Promise<Ban> => {
    try {
        const response = await axiosInstance.post<Ban>("/bans", createBanDto);
        return response.data;
    } catch (error) {
        throw error as AxiosError;
    }
};

export default createNewBan;
