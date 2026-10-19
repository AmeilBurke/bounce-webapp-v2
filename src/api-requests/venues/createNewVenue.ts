import type { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import type { CreateVenueDto } from "@/types/dto/create-venue-dto";
import type { Venue } from "@/types/Venue";

const createNewVenue = async (createVenueDto: CreateVenueDto): Promise<Venue> => {
    const formData = new FormData();
    formData.append("image", createVenueDto.image);
    formData.append("name", createVenueDto.name);
    // Repeated keys arrive as an array on the backend
    createVenueDto.managers?.forEach((id) => formData.append("managers", id));

    try {
        const response = await axiosInstance.post<Venue>("/venues", formData);
        return response.data;
    } catch (error) {
        throw error as AxiosError;
    }
};

export default createNewVenue;
