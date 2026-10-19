import type { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import type { CreateVenueDto } from "@/types/dto/create-venue-dto";
import type { Venue } from "@/types/Venue";

const createNewVenue = async (createVenueDto: CreateVenueDto): Promise<Venue> => {
    try {
        const response = await axiosInstance.post<Venue>("/venues", createVenueDto);
        return response.data;
    } catch (error) {
        throw error as AxiosError;
    }
};

export default createNewVenue;
