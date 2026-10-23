import type { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import type { Venue } from "@/types/Venue";

const deleteVenue = async (id: Venue["id"]): Promise<string> => {
    try {
        const response = await axiosInstance.delete<string>(`/venues/${id}`);
        return response.data;
    } catch (error) {
        throw error as AxiosError;
    }
};

export default deleteVenue;
