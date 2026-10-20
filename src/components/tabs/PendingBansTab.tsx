import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { refresh } from "@/utils/queries";
import { Button, SimpleGrid, Text } from "@chakra-ui/react";
import toast from "react-hot-toast";
import Stacker from "../Stacker";
import Dialog from "../Dialog";
import PendingBanCard from "../PendingBanCard";
import { CardGridSkeleton, ImageCardSkeleton } from "../Skeletons";
import { pendingBansQueryOptions } from "@/api-requests/bans/bans.queries";
import approveBan from "@/api-requests/bans/approveBan";
import deleteBan from "@/api-requests/bans/deleteBan";
import type { Ban, BanWithPerson } from "@/types/BannedPerson";

const PendingBansTab = () => {
    const queryClient = useQueryClient();
    const { data: bans, isPending, isError } = useQuery(pendingBansQueryOptions);
    const [banToDelete, setBanToDelete] = useState<BanWithPerson | undefined>(undefined);
    const [submittingBanId, setSubmittingBanId] = useState<Ban["id"] | undefined>(undefined);

    const closeDialog = () => setBanToDelete(undefined);

    // Approving or deleting changes both the pending list and the banned people list
    const refreshBans = () =>
        Promise.all([
            refresh(queryClient, ["bans"]),
            refresh(queryClient, ["banned-people"]),
        ]);

    const onApprove = async (ban: BanWithPerson) => {
        try {
            setSubmittingBanId(ban.id);
            await approveBan(ban.id);
            await refreshBans();
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
            await refreshBans();
            toast.success("Ban request rejected");
            closeDialog();
        } catch {
            toast.error("Couldn't reject ban");
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
                    card={<ImageCardSkeleton lines={9} />}
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
                    <PendingBanCard
                        key={ban.id}
                        ban={ban}
                        isApproving={submittingBanId === ban.id && banToDelete === undefined}
                        isLocked={submittingBanId !== undefined}
                        onApprove={() => onApprove(ban)}
                        onDelete={() => setBanToDelete(ban)}
                    />
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
                title="Reject this ban request?"
                body={
                    <Text>
                        {banToDelete?.bannedPerson.name} won't be banned, and this request will
                        be deleted. This can't be undone.
                    </Text>
                }
                footer={
                    <>
                        <Button onClick={closeDialog} variant="outline" loading={isDeleting}>
                            Cancel
                        </Button>
                        <Button onClick={onDelete} colorPalette="red" loading={isDeleting}>
                            Reject
                        </Button>
                    </>
                }
            />
        </Stacker>
    );
};

export default PendingBansTab;
