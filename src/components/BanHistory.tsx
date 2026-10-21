import { HStack, IconButton, Skeleton, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { LuPencil } from "react-icons/lu";
import EmptyMessage from "./EmptyMessage";
import Panel from "./Panel";
import Stacker from "./Stacker";
import BanStatusBadge from "./BanStatusBadge";
import BanEdit from "./BanEdit";
import type { Ban } from "@/types/BannedPerson";
import { Role } from "@/types/Role";
import { userDetailsQueryOptions } from "@/api-requests/auth/user.queries";
import { venuesQueryOptions } from "@/api-requests/venues/venues.queries";
import { canManageBan, formatBanDate, isBanActive, managedVenueIds } from "@/utils/bans";

type BanHistoryProps = {
    bans: Ban[];
    showVenues?: boolean;
};

const BanHistory = ({ bans, showVenues = true }: BanHistoryProps) => {
    const { data: user } = useQuery(userDetailsQueryOptions);
    const { data: venues, isPending: isVenuesPending } = useQuery(venuesQueryOptions);
    const [editingBanId, setEditingBanId] = useState<Ban["id"] | undefined>(undefined);

    const managed = useMemo(() => managedVenueIds(user, venues), [user, venues]);

    // Venue managers can only move a ban between venues they manage
    const venueOptions = useMemo(
        () =>
            (venues ?? [])
                .filter((venue) => user?.role === Role.ADMIN || managed.has(venue.id))
                .map((venue) => ({ value: venue.id, label: venue.name })),
        [venues, user, managed],
    );

    // Only roles that can edit bans wait on the venue list to know which ones they can edit
    const isCheckingEditable =
        isVenuesPending && (user?.role === Role.ADMIN || user?.role === Role.VENUE_MANAGER);

    if (bans.length === 0) {
        return <EmptyMessage title="No bans on record" />;
    }

    return (
        <Stacker direction="column" gap={3}>
            {bans.map((ban) => (
                <Panel key={ban.id} w="full" p={4}>
                    {editingBanId === ban.id ? (
                        <BanEdit
                            ban={ban}
                            venueOptions={venueOptions}
                            onDone={() => setEditingBanId(undefined)}
                        />
                    ) : (
                        <Stacker direction="column" gap={1}>
                            <HStack w="full" justify="space-between" align="flex-start">
                                <Text fontWeight="semibold" overflowWrap="anywhere">
                                    {ban.reason}
                                </Text>
                                <HStack gap={1}>
                                    <BanStatusBadge isActive={isBanActive(ban)} />
                                    {isCheckingEditable && <Skeleton boxSize="8" rounded="l2" />}
                                    {!isCheckingEditable && canManageBan(ban, user, managed) && (
                                        <IconButton
                                            onClick={() => setEditingBanId(ban.id)}
                                            aria-label="Edit ban"
                                            size="sm"
                                            variant="ghost"
                                        >
                                            <LuPencil />
                                        </IconButton>
                                    )}
                                </HStack>
                            </HStack>
                            <Text color="fg.muted" fontSize="sm">
                                {formatBanDate(ban.startDate)} – {formatBanDate(ban.endDate)}
                            </Text>
                            {showVenues && (
                                <Text color="fg.muted" fontSize="sm">
                                    Venues: {ban.venueBans.map((vb) => vb.venue.name).join(", ")}
                                </Text>
                            )}
                            <Text color="fg.muted" fontSize="sm">
                                Issued by {ban.createdBy.name}
                            </Text>
                        </Stacker>
                    )}
                </Panel>
            ))}
        </Stacker>
    );
};

export default BanHistory;
