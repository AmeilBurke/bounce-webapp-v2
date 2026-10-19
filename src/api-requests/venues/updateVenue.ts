import type { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import type { Venue } from "@/types/Venue";
import type { UpdateVenueDto } from "@/types/dto/update-venue-dto";

// Sent as JSON rather than FormData so an empty list can clear all managers
const updateVenue = async (updateVenueDto: UpdateVenueDto, id: Venue["id"]): Promise<Venue> => {
    try {
        const response = await axiosInstance.patch<Venue>(`/venues/${id}`, updateVenueDto);
        return response.data;
    } catch (error) {
        throw error as AxiosError;
    }
};

export default updateVenue;
