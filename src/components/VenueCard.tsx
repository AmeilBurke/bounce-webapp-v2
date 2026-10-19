import { Card, Text } from "@chakra-ui/react";
import type { Venue } from "@/types/Venue";

type VenueCardProps = {
    venue: Venue;
    onOpen: () => void;
};

const VenueCard = ({ venue, onOpen }: VenueCardProps) => {
    const managerNames = venue.managers.map((m) => m.staff.name).join(", ");

    return (
        <Card.Root h="full" cursor="pointer" onClick={onOpen}>
            <Card.Body gap={2}>
                <Text fontWeight="medium">{venue.name}</Text>
                {managerNames && (
                    <Text color="fg.muted" fontSize="sm">
                        Managed by {managerNames}
                    </Text>
                )}
            </Card.Body>
        </Card.Root>
    );
};

export default VenueCard;
