import { Card } from "@chakra-ui/react";
import ClampedText from "./ClampedText";
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
                <ClampedText fontWeight="medium" lines={1}>
                    {venue.name}
                </ClampedText>
                <ClampedText color="fg.muted" fontSize="sm" lines={2}>
                    {managerNames ? `Managed by ${managerNames}` : "No managers assigned"}
                </ClampedText>
            </Card.Body>
        </Card.Root>
    );
};

export default VenueCard;
