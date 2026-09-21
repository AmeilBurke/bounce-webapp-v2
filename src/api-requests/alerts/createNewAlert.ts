import type { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import type { CreateAlertDto } from "@/types/dto/create-alert-dto";
import type { Alert } from "@/types/Alert";

const createNewAlert = async (createAlertDto: CreateAlertDto): Promise<Alert> => {
    const formData = new FormData();
    formData.append("image", createAlertDto.image);
    formData.append("reason", createAlertDto.reason);

    try {
        const response = await axiosInstance.post<Alert>("/alerts", formData);
        return response.data;
    } catch (error) {
        throw error as AxiosError;
    }
};

export default createNewAlert;