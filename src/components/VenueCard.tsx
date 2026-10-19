import Stacker from "./Stacker";
import { Image, Text } from "@chakra-ui/react";
import type { Venue } from "@/types/Venue";

type VenueCardProps = {
    venue: Venue;
    onOpen: () => void;
};

const VenueCard = ({ venue, onOpen }: VenueCardProps) => {
    const managerNames = venue.managers.map((m) => m.staff.name).join(", ");

    return (
        <Stacker direction="column" gap={2}>
            <Image
                aspectRatio={1}
                src={venue.imagePath}
                alt={venue.name}
                objectFit="cover"
                cursor="pointer"
                onClick={onOpen}
            />
            <Text fontWeight="medium">{venue.name}</Text>
            {managerNames && (
                <Text color="fg.muted" fontSize="sm">
                    Managed by {managerNames}
                </Text>
            )}
        </Stacker>
    );
};

export default VenueCard;
