import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { refresh } from "@/utils/queries";
import { Button, SimpleGrid, Text } from "@chakra-ui/react";
import { LuCircleCheck } from "react-icons/lu";
import toast from "react-hot-toast";
import { apiErrorMessage } from "@/utils/errors";
import Stacker from "../Stacker";
import Dialog from "../Dialog";
import PendingBanCard from "../PendingBanCard";
import BanEdit from "../BanEdit";
import EmptyMessage from "../EmptyMessage";
import SectionLabel from "../SectionLabel";
import TabHeader from "../TabHeader";
import StatusPill from "../StatusPill";
import { CardGridSkeleton, PendingBanCardSkeleton } from "../Skeletons";
import { pendingBansQueryOptions } from "@/api-requests/bans/bans.queries";
import { venuesQueryOptions } from "@/api-requests/venues/venues.queries";
import approveBan from "@/api-requests/bans/approveBan";
import deleteBan from "@/api-requests/bans/deleteBan";
import type { Ban, BanWithPerson } from "@/types/BannedPerson";

// Cards lay the photo beside the details, so they need a wide column
const GRID_COLUMNS = [1, null, null, null, 2];

const PendingBansTab = () => {
    const queryClient = useQueryClient();
    const { data: bans, isPending, isError } = useQuery(pendingBansQueryOptions);
    const [banToDelete, setBanToDelete] = useState<BanWithPerson | undefined>(undefined);
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [banToEdit, setBanToEdit] = useState<BanWithPerson | undefined>(undefined);
    // Kept apart from the open flags so each dialog's content stays rendered while it animates closed
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [submittingBanId, setSubmittingBanId] = useState<Ban["id"] | undefined>(undefined);

    // Only admins see pending bans, and admins can move a ban to any venue
    const { data: venues } = useQuery(venuesQueryOptions);
    const venueOptions = useMemo(
        () => (venues ?? []).map((venue) => ({ value: venue.id, label: venue.name })),
        [venues],
    );

    const openRejectDialog = (ban: BanWithPerson) => {
        setBanToDelete(ban);
        setIsRejectOpen(true);
    };
    const closeDialog = () => setIsRejectOpen(false);
    const openEditDialog = (ban: BanWithPerson) => {
        setBanToEdit(ban);
        setIsEditOpen(true);
    };
    const closeEditDialog = () => setIsEditOpen(false);

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
        } catch (err) {
            toast.error(apiErrorMessage(err, "Couldn't approve ban"));
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
        } catch (err) {
            toast.error(apiErrorMessage(err, "Couldn't reject ban"));
        } finally {
            setSubmittingBanId(undefined);
        }
    };

    const renderBans = () => {
        if (isPending) {
            return <CardGridSkeleton columns={GRID_COLUMNS} count={4} card={<PendingBanCardSkeleton />} />;
        }

        if (isError) {
            return (
                <EmptyMessage
                    kind="error"
                    colorPalette="bad"
                    title="Couldn't load pending bans"
                    description="Check your connection and try again"
                />
            );
        }

        if (bans.length === 0) {
            return (
                <EmptyMessage
                    icon={<LuCircleCheck />}
                    colorPalette="ok"
                    title="All caught up"
                    description="No bans are waiting for approval"
                />
            );
        }

        return (
            <SimpleGrid columns={GRID_COLUMNS} gap={3} w="full">
                {bans.map((ban) => (
                    <PendingBanCard
                        key={ban.id}
                        ban={ban}
                        isApproving={submittingBanId === ban.id && !isRejectOpen}
                        isLocked={submittingBanId !== undefined}
                        onApprove={() => onApprove(ban)}
                        onDelete={() => openRejectDialog(ban)}
                        onEdit={() => openEditDialog(ban)}
                    />
                ))}
            </SimpleGrid>
        );
    };

    const renderPill = () => {
        if (isPending) return <StatusPill colorPalette="gray">Checking…</StatusPill>;
        if (isError) return <StatusPill colorPalette="bad">Unavailable</StatusPill>;
        if (bans.length === 0) return <StatusPill colorPalette="ok">All clear</StatusPill>;
        return (
            <StatusPill colorPalette="accent" isPulsing>
                {bans.length} waiting
            </StatusPill>
        );
    };

    const isDeleting = banToDelete !== undefined && submittingBanId === banToDelete.id;

    return (
        <Stacker direction={"column"}>
            <TabHeader
                title="Pending Bans"
                description="Bans requested by staff don't take effect until an admin approves them"
                aside={renderPill()}
            />

            <Stacker direction={"column"} gap={3}>
                <SectionLabel>Requests</SectionLabel>
                {renderBans()}
            </Stacker>

            <Dialog
                isOpen={isRejectOpen}
                setIsOpen={(open) => {
                    if (!open) closeDialog();
                }}
                onExitComplete={() => setBanToDelete(undefined)}
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
                        <Button onClick={onDelete} colorPalette="bad" loading={isDeleting}>
                            Reject
                        </Button>
                    </>
                }
            />

            <Dialog
                isOpen={isEditOpen}
                setIsOpen={(open) => {
                    if (!open) closeEditDialog();
                }}
                onExitComplete={() => setBanToEdit(undefined)}
                title={`Edit ban for ${banToEdit?.bannedPerson.name ?? ""}`}
                body={
                    banToEdit ? (
                        <BanEdit
                            // Remount so the form resets when a different ban is opened
                            key={banToEdit.id}
                            ban={banToEdit}
                            venueOptions={venueOptions}
                            onDone={closeEditDialog}
                        />
                    ) : (
                        <></>
                    )
                }
            />
        </Stacker>
    );
};

export default PendingBansTab;
