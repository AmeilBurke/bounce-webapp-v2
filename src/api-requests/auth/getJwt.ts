import type { Staff } from "@/types/Staff";
import axiosInstance from "../axiosInstance";
import type { AxiosError } from "axios";

const getJwt = async (
    email: Staff["email"],
    password: Staff["password"],
): Promise<{ access_token: string }> => {
    try {
        const response = await axiosInstance.post<{ access_token: string }>(
            "/authentication/sign-in",
            {
                email: email,
                password: password,
            },
        );
        return response.data;
    } catch (error) {
        throw error as AxiosError;
    }
};

export default getJwt;
