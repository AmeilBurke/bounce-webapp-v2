import type { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import type { Staff } from "@/types/Staff";

const deleteStaff = async (id: Staff["id"]): Promise<string> => {
    try {
        const response = await axiosInstance.delete<string>(`/staff/${id}`);
        return response.data;
    } catch (error) {
        throw error as AxiosError;
    }
};

export default deleteStaff;