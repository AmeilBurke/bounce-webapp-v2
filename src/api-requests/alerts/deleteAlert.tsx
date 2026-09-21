import type { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";

const deleteAlert = async (alertId: string): Promise<String> => {

    try {
        const response = await axiosInstance.delete<String>(`/alerts/${alertId}`);
        return response.data;
    } catch (error) {
        throw error as AxiosError;
    }
};

export default deleteAlert;