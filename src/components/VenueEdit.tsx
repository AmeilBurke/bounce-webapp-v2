import { Button, HStack, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { refresh } from "@/utils/queries";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { apiErrorMessage } from "@/utils/errors";
import Dialog from "./Dialog";
import Form from "./Form";
import Stacker from "./Stacker";
import UpdateVenueForm from "./forms/UpdateVenueForm";
import updateVenue from "@/api-requests/venues/updateVenue";
import deleteVenue from "@/api-requests/venues/deleteVenue";
import { UpdateVenueSchema, type UpdateVenueFormValues } from "@/schemas/update-venue.schema";
import type { Venue } from "@/types/Venue";

type VenueEditProps = {
    venue: Venue;
    closeDialog: () => void;
};

const VenueEdit = ({ venue, closeDialog }: VenueEditProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<UpdateVenueFormValues>({
        resolver: zodResolver(UpdateVenueSchema),
        mode: "onChange",
        defaultValues: {
            name: venue.name,
            managers: venue.managers.map((m) => m.staffId),
            dutyManagers: venue.dutyManagers.map((m) => m.staffId),
        },
    });

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const onUpdateVenue = async (data: UpdateVenueFormValues) => {
        try {
            await updateVenue(
                { name: data.name, managers: data.managers, dutyManagers: data.dutyManagers },
                venue.id,
            );
            toast.success("Venue Updated");
            // Bans show venue names, so they need refreshing after a rename
            await Promise.all([
                refresh(queryClient, ["venues"]),
                refresh(queryClient, ["bans"]),
                refresh(queryClient, ["banned-people"]),
            ]);
            closeDialog();
        } catch (err) {
            toast.error(apiErrorMessage(err, "Couldn't update venue"));
        }
    };

    const onDeleteVenue = async () => {
        try {
            setIsDeleting(true);
            const result = await deleteVenue(venue.id);
            toast.success(result);
            // Leave the venue's page before refreshing so it doesn't refetch a venue that's gone
            await navigate({ to: "/", search: { tab: "venues" } });
            queryClient.removeQueries({ queryKey: ["venues", venue.id] });
            await Promise.all([
                refresh(queryClient, ["venues"]),
                refresh(queryClient, ["bans"]),
                refresh(queryClient, ["banned-people"]),
            ]);
        } catch (err) {
            toast.error(apiErrorMessage(err, "Couldn't delete venue"));
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Form w="full" onSubmit={handleSubmit(onUpdateVenue)}>
                <Stacker direction="column">
                    <UpdateVenueForm control={control} errors={errors} />

                    <HStack w="full" justify="flex-end">
                        <Button
                            onClick={() => setIsDeleteDialogOpen(true)}
                            colorPalette="bad"
                            variant="outline"
                            mr="auto"
                            disabled={isSubmitting}
                        >
                            Delete
                        </Button>
                        <Button onClick={closeDialog} variant="outline" disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!isValid} loading={isSubmitting}>
                            Save
                        </Button>
                    </HStack>
                </Stacker>
            </Form>

            <Dialog
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
                title={`Delete ${venue.name}?`}
                body={
                    <Text>
                        This venue will be removed, along with any bans that only cover this
                        venue. Bans that also cover other venues will stay in place there. This
                        can't be undone.
                    </Text>
                }
                footer={
                    <>
                        <Button
                            onClick={() => setIsDeleteDialogOpen(false)}
                            variant="outline"
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button onClick={onDeleteVenue} colorPalette="bad" loading={isDeleting}>
                            Delete
                        </Button>
                    </>
                }
            />
        </>
    );
};

export default VenueEdit;
