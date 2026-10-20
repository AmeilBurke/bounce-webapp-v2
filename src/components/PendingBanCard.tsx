import { Button, Grid, HStack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import Stacker from "./Stacker";
import ClampedText from "./ClampedText";
import { SkeletonImage } from "./Skeletons";
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
};

const Detail = ({ label, children }: { label: string; children: ReactNode }) => (
    <>
        <Text color="fg.muted" fontSize="sm" lineHeight="1.5rem">
            {label}
        </Text>
        {children}
    </>
);

const PendingBanCard = ({ ban, isApproving, isLocked, onApprove, onDelete }: PendingBanCardProps) => {
    // Only admins see pending bans, and admins see every venue
    const { data: venues } = useQuery(venuesQueryOptions);

    const venueNames = ban.venueBans.map((vb) => vb.venue.name);
    const coversEveryVenue = venues !== undefined && venues.length > 0 && venueNames.length === venues.length;

    return (
        <Stacker direction="column" gap={3}>
            <SkeletonImage
                aspectRatio={1}
                src={ban.bannedPerson.imagePath}
                alt={ban.bannedPerson.name}
                objectFit="cover"
            />

            <ClampedText fontWeight="semibold" fontSize="lg" lines={1}>
                {ban.bannedPerson.name}
            </ClampedText>

            <Grid templateColumns="auto 1fr" columnGap={3} rowGap={1.5} w="full">
                <Detail label="Reason">
                    <ClampedText lines={2}>{ban.reason}</ClampedText>
                </Detail>
                <Detail label="Venues">
                    <ClampedText lines={2}>
                        {coversEveryVenue ? "All venues" : venueNames.join(", ")}
                    </ClampedText>
                </Detail>
                <Detail label="Starts">
                    <ClampedText lines={1}>
                        {`${describeBanStart(ban.startDate)} · ${formatBanDate(ban.startDate)}`}
                    </ClampedText>
                </Detail>
                <Detail label="Ends">
                    <ClampedText lines={1}>
                        {`${formatBanDate(ban.endDate)} · ${describeBanLength(ban.startDate, ban.endDate)}`}
                    </ClampedText>
                </Detail>
                <Detail label="Asked by">
                    <ClampedText lines={1}>{ban.createdBy.name}</ClampedText>
                </Detail>
            </Grid>

            <HStack w="full">
                <Button
                    flex={1}
                    size="sm"
                    colorPalette="green"
                    onClick={onApprove}
                    loading={isApproving}
                    disabled={isLocked}
                >
                    Approve
                </Button>
                <Button
                    flex={1}
                    size="sm"
                    variant="outline"
                    colorPalette="red"
                    onClick={onDelete}
                    disabled={isLocked}
                >
                    Reject
                </Button>
            </HStack>
        </Stacker>
    );
};

export default PendingBanCard;
