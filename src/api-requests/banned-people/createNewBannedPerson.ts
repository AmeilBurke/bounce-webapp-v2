import type { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import type { CreateBannedPersonDto } from "@/types/dto/create-banned-person-dto";
import type { BannedPerson } from "@/types/BannedPerson";

const createNewBannedPerson = async (createBannedPersonDto: CreateBannedPersonDto): Promise<BannedPerson> => {
    const formData = new FormData();
    formData.append("image", createBannedPersonDto.image);
    formData.append("name", createBannedPersonDto.name);

    try {
        const response = await axiosInstance.post<BannedPerson>("/banned-people", formData);
        return response.data;
    } catch (error) {
        throw error as AxiosError;
    }
};

export default createNewBannedPerson;
