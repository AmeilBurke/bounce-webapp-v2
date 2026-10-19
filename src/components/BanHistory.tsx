import { HStack, IconButton, Separator, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useMemo, useState } from "react";
import { LuPencil } from "react-icons/lu";
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
};

const BanHistory = ({ bans }: BanHistoryProps) => {
    const { data: user } = useQuery(userDetailsQueryOptions);
    const { data: venues } = useQuery(venuesQueryOptions);
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

    if (bans.length === 0) {
        return <Text>No bans on record</Text>;
    }

    return (
        <Stacker direction="column" gap={4}>
            {bans.map((ban, index) => (
                <Fragment key={ban.id}>
                    {index > 0 && <Separator w="full" />}
                    {editingBanId === ban.id ? (
                        <BanEdit
                            ban={ban}
                            venueOptions={venueOptions}
                            onDone={() => setEditingBanId(undefined)}
                        />
                    ) : (
                        <Stacker direction="column" gap={1}>
                            <HStack w="full" justify="space-between">
                                <Text fontWeight="medium">{ban.reason}</Text>
                                <HStack gap={1}>
                                    <BanStatusBadge isActive={isBanActive(ban)} />
                                    {canManageBan(ban, user, managed) && (
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
                            <Text color="fg.muted" fontSize="sm">
                                Venues: {ban.venueBans.map((vb) => vb.venue.name).join(", ")}
                            </Text>
                            <Text color="fg.muted" fontSize="sm">
                                Issued by {ban.createdBy.name}
                            </Text>
                        </Stacker>
                    )}
                </Fragment>
            ))}
        </Stacker>
    );
};

export default BanHistory;
