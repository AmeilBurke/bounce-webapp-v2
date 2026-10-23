import { Box, Button, Flex, HStack, Stack, Text, Wrap } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { LuCheck, LuPencil, LuX } from "react-icons/lu";
import Panel from "./Panel";
import { SkeletonImage } from "./Skeletons";
import StatusPill from "./StatusPill";
import { venuesQueryOptions } from "@/api-requests/venues/venues.queries";
import type { BanWithPerson } from "@/types/BannedPerson";
import { describeBanLength, describeBanStart, formatBanDate } from "@/utils/bans";

type PendingBanCardProps = {
    ban: BanWithPerson;
    isApproving: boolean;
    // Any ban being approved or deleted locks every card's buttons
    isLocked: boolean;
    onApprove: () => void;
    onDelete: () => void;
    onEdit: () => void;
};

const TimelineEnd = ({ label, date, align }: { label: string; date: string; align: "start" | "end" }) => (
    <Box textAlign={align} flexShrink={0}>
        <Text color="fg.muted" fontSize="xs">
            {label}
        </Text>
        <Text fontSize="sm" fontWeight="bold" fontVariantNumeric="tabular-nums">
            {formatBanDate(date)}
        </Text>
    </Box>
);

// Start and end dates joined by a line labelled with how long the ban lasts
const BanTimeline = ({ startDate, endDate }: { startDate: string; endDate: string }) => (
    <HStack gap={2} w="full">
        <TimelineEnd label="Starts" date={startDate} align="start" />
        <HStack flex={1} gap={2} minW={8}>
            <Box flex={1} h="1px" bg="border" />
            <Text
                fontSize="xs"
                fontWeight="semibold"
                color="fg.muted"
                borderWidth="1px"
                rounded="full"
                px={2}
                whiteSpace="nowrap"
            >
                {describeBanLength(startDate, endDate)}
            </Text>
            <Box flex={1} h="1px" bg="border" />
        </HStack>
        <TimelineEnd label="Ends" date={endDate} align="end" />
    </HStack>
);

const VenuePill = ({ children }: { children: string }) => (
    <Box borderWidth="1px" rounded="full" px={2.5} py={0.5} fontSize="xs" fontWeight="semibold">
        {children}
    </Box>
);

const PendingBanCard = ({ ban, isApproving, isLocked, onApprove, onDelete, onEdit }: PendingBanCardProps) => {
    // Only admins see pending bans, and admins see every venue
    const { data: venues } = useQuery(venuesQueryOptions);

    const venueNames = ban.venueBans.map((vb) => vb.venue.name);
    const coversEveryVenue = venues !== undefined && venues.length > 0 && venueNames.length === venues.length;

    const hasStarted = new Date(ban.startDate) <= new Date();
    const startNote = `${hasStarted ? "Started" : "Starts"} ${describeBanStart(ban.startDate).toLowerCase()}`;

    return (
        <Panel display="flex" flexDirection="column" h="full" overflow="hidden">
            <Flex flex={1}>
                <Box w={["28", null, "36"]} flexShrink={0} borderEndWidth="1px">
                    <SkeletonImage
                        aspectRatio={3 / 4}
                        src={ban.bannedPerson.imagePath}
                        alt={ban.bannedPerson.name}
                        objectFit="cover"
                    />
                </Box>

                <Stack flex={1} minW={0} gap={3} p={4}>
                    <HStack justify="space-between" align="flex-start" gap={3}>
                        <Box minW={0}>
                            <Text fontWeight="bold" fontSize="lg" letterSpacing="-0.02em" lineHeight="short" overflowWrap="anywhere">
                                {ban.bannedPerson.name}
                            </Text>
                            <Text color="fg.muted" fontSize="sm" overflowWrap="anywhere">
                                Requested by {ban.createdBy.name}
                            </Text>
                        </Box>
                        <Box hideBelow="sm">
                            <StatusPill colorPalette="accent">Pending</StatusPill>
                        </Box>
                    </HStack>

                    <Text fontSize="sm" overflowWrap="anywhere">
                        {ban.reason}
                    </Text>

                    <Wrap gap={1.5} mt="auto">
                        {coversEveryVenue ? (
                            <VenuePill>All venues</VenuePill>
                        ) : (
                            venueNames.map((name) => <VenuePill key={name}>{name}</VenuePill>)
                        )}
                    </Wrap>
                </Stack>
            </Flex>

            <Box px={4} py={3} borderTopWidth="1px">
                <BanTimeline startDate={ban.startDate} endDate={ban.endDate} />
            </Box>

            <HStack px={4} py={3} gap={3} borderTopWidth="1px" bg="canvas" justify="space-between" wrap="wrap">
                <Text color="fg.muted" fontSize="sm">
                    {startNote}
                </Text>
                <HStack gap={2} flex={["1", "0 0 auto"]}>
                    <Button
                        flex={[1, "none"]}
                        size="sm"
                        variant="outline"
                        rounded="lg"
                        onClick={onEdit}
                        disabled={isLocked}
                    >
                        <LuPencil /> Edit
                    </Button>
                    <Button
                        flex={[1, "none"]}
                        size="sm"
                        colorPalette="bad"
                        rounded="lg"
                        onClick={onDelete}
                        disabled={isLocked}
                    >
                        <LuX /> Reject
                    </Button>
                    <Button
                        flex={[1, "none"]}
                        size="sm"
                        colorPalette="ok"
                        rounded="lg"
                        onClick={onApprove}
                        loading={isApproving}
                        disabled={isLocked}
                    >
                        <LuCheck /> Approve
                    </Button>
                </HStack>
            </HStack>
        </Panel>
    );
};

export default PendingBanCard;
