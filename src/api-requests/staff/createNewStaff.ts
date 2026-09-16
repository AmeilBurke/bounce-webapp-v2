import type { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import type { CreateStaffDto } from "@/types/dto/create-staff-dto";
import type { Staff } from "@/types/Staff";

const createNewStaff = async (createStaffDto: CreateStaffDto): Promise<Staff> => {
    try {
        const response = await axiosInstance.post<Staff>("/staff", createStaffDto);
        return response.data;
    } catch (error) {
        throw error as AxiosError;
    }
};

export default createNewStaff;