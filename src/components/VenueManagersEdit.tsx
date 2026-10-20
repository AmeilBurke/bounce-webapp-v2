import { Button, HStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { refresh } from "@/utils/queries";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Form from "./Form";
import Stacker from "./Stacker";
import VenueManagersForm from "./forms/VenueManagersForm";
import updateVenue from "@/api-requests/venues/updateVenue";
import {
    UpdateVenueManagersSchema,
    type UpdateVenueManagersFormValues,
} from "@/schemas/update-venue-managers.schema";
import type { Venue } from "@/types/Venue";

type VenueManagersEditProps = {
    venue: Venue;
    closeDialog: () => void;
};

const VenueManagersEdit = ({ venue, closeDialog }: VenueManagersEditProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UpdateVenueManagersFormValues>({
        resolver: zodResolver(UpdateVenueManagersSchema),
        mode: "onChange",
        defaultValues: {
            managers: venue.managers.map((m) => m.staffId),
            dutyManagers: venue.dutyManagers.map((m) => m.staffId),
        },
    });

    const queryClient = useQueryClient();

    const onUpdateManagers = async (data: UpdateVenueManagersFormValues) => {
        try {
            await updateVenue({ managers: data.managers, dutyManagers: data.dutyManagers }, venue.id);
            toast.success("Managers Updated");
            await refresh(queryClient, ["venues"]);
            closeDialog();
        } catch {
            toast.error("Couldn't update managers");
        }
    };

    return (
        <Form w="full" onSubmit={handleSubmit(onUpdateManagers)}>
            <Stacker direction="column">
                <VenueManagersForm control={control} errors={errors} />

                <HStack w="full" justify="flex-end">
                    <Button onClick={closeDialog} variant="outline" disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={isSubmitting}>
                        Save
                    </Button>
                </HStack>
            </Stacker>
        </Form>
    );
};

export default VenueManagersEdit;
