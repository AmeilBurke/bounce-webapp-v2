import type { Staff } from "@/types/Staff";
import axiosInstance from "../axiosInstance";

const getProfileDetails = async (): Promise<Staff> => {
    const response = await axiosInstance.get<Staff>("/authentication/profile");
    return response.data;
};

export default getProfileDetails;
