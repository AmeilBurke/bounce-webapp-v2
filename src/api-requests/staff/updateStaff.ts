import type { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import type { Staff } from "@/types/Staff";
import type { UpdateStaffDto } from "@/types/dto/update-staff-dto";

const updateStaff = async (updateStaffDto: UpdateStaffDto, id: Staff["id"]): Promise<Staff> => {
    try {
        const response = await axiosInstance.patch<Staff>(`/staff/${id}`, updateStaffDto);
        return response.data;
    } catch (error) {
        throw error as AxiosError;
    }
};

export default updateStaff;