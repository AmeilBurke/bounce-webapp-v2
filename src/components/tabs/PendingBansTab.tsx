import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, HStack, Image, SimpleGrid, Text } from "@chakra-ui/react";
import toast from "react-hot-toast";
import Stacker from "../Stacker";
import Dialog from "../Dialog";
import { CardGridSkeleton, ImageCardSkeleton } from "../Skeletons";
import { pendingBansQueryOptions } from "@/api-requests/bans/bans.queries";
import approveBan from "@/api-requests/bans/approveBan";
import deleteBan from "@/api-requests/bans/deleteBan";
import type { Ban, BanWithPerson } from "@/types/BannedPerson";
import { formatBanDate } from "@/utils/bans";

const PendingBansTab = () => {
    const queryClient = useQueryClient();
    const { data: bans, isPending, isError } = useQuery(pendingBansQueryOptions);
    const [banToDelete, setBanToDelete] = useState<BanWithPerson | undefined>(undefined);
    const [submittingBanId, setSubmittingBanId] = useState<Ban["id"] | undefined>(undefined);

    const closeDialog = () => setBanToDelete(undefined);

    // Approving or deleting changes both the pending list and the banned people list
    const refresh = () =>
        Promise.all([
            queryClient.invalidateQueries({ queryKey: ["bans"] }),
            queryClient.invalidateQueries({ queryKey: ["banned-people"] }),
        ]);

    const onApprove = async (ban: BanWithPerson) => {
        try {
            setSubmittingBanId(ban.id);
            await approveBan(ban.id);
            await refresh();
            toast.success(`Ban approved for ${ban.bannedPerson.name}`);
        } catch {
            toast.error("Couldn't approve ban");
        } finally {
            setSubmittingBanId(undefined);
        }
    };

    const onDelete = async () => {
        if (banToDelete === undefined) return;

        try {
            setSubmittingBanId(banToDelete.id);
            await deleteBan(banToDelete.id);
            await refresh();
            toast.success("Pending ban deleted");
            closeDialog();
        } catch {
            toast.error("Couldn't delete ban");
        } finally {
            setSubmittingBanId(undefined);
        }
    };

    const renderBans = () => {
        if (isPending) {
            return (
                <CardGridSkeleton
                    columns={[1, 2, null, 4]}
                    count={4}
                    card={<ImageCardSkeleton lines={5} />}
                />
            );
        }

        if (isError) {
            return <Text>Couldn't load pending bans</Text>;
        }

        if (bans.length === 0) {
            return <Text>No bans are waiting for approval</Text>;
        }

        return (
            <SimpleGrid columns={[1, 2, null, 4]} columnGap={4} rowGap={8}>
                {bans.map((ban) => (
                    <Stacker key={ban.id} direction="column" gap={2}>
                        <Image
                            aspectRatio={1}
                            src={ban.bannedPerson.imagePath}
                            alt={ban.bannedPerson.name}
                            objectFit="cover"
                        />
                        <Text fontWeight="medium">{ban.bannedPerson.name}</Text>
                        <Text>{ban.reason}</Text>
                        <Text color="fg.muted" fontSize="sm">
                            {formatBanDate(ban.startDate)} – {formatBanDate(ban.endDate)}
                        </Text>
                        <Text color="fg.muted" fontSize="sm">
                            Venues: {ban.venueBans.map((vb) => vb.venue.name).join(", ")}
                        </Text>
                        <Text color="fg.muted" fontSize="sm">
                            Requested by {ban.createdBy.name}
                        </Text>
                        <HStack w="full">
                            <Button
                                flex={1}
                                size="sm"
                                colorPalette="green"
                                onClick={() => onApprove(ban)}
                                loading={submittingBanId === ban.id && banToDelete === undefined}
                                disabled={submittingBanId !== undefined}
                            >
                                Accept
                            </Button>
                            <Button
                                flex={1}
                                size="sm"
                                variant="outline"
                                colorPalette="red"
                                onClick={() => setBanToDelete(ban)}
                                disabled={submittingBanId !== undefined}
                            >
                                Delete
                            </Button>
                        </HStack>
                    </Stacker>
                ))}
            </SimpleGrid>
        );
    };

    const isDeleting = banToDelete !== undefined && submittingBanId === banToDelete.id;

    return (
        <Stacker direction={"column"}>
            {renderBans()}

            <Dialog
                isOpen={banToDelete !== undefined}
                setIsOpen={(open) => {
                    if (!open) closeDialog();
                }}
                title="Delete this pending ban?"
                body={
                    <Text>
                        The ban request for {banToDelete?.bannedPerson.name} will be permanently
                        deleted. This action cannot be undone.
                    </Text>
                }
                footer={
                    <>
                        <Button onClick={closeDialog} variant="outline" loading={isDeleting}>
                            Cancel
                        </Button>
                        <Button onClick={onDelete} colorPalette="red" loading={isDeleting}>
                            Delete
                        </Button>
                    </>
                }
            />
        </Stacker>
    );
};

export default PendingBansTab;
