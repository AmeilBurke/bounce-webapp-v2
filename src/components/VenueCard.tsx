import { HStack, Icon, Stack, Text } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";
import Panel from "./Panel";
import type { Venue } from "@/types/Venue";

type VenueCardProps = {
    venue: Venue;
    onOpen: () => void;
};

const VenueCard = ({ venue, onOpen }: VenueCardProps) => {
    const managerNames = venue.managers.map((m) => m.staff.name).join(", ");

    return (
        <Panel asChild isClickable h="full" p={4} textAlign="start">
            <button type="button" onClick={onOpen}>
                <HStack h="full" justify="space-between" align="flex-start" gap={3}>
                    <Stack gap={1} minW={0}>
                        <Text fontWeight="semibold" overflowWrap="anywhere">
                            {venue.name}
                        </Text>
                        <Text color="fg.muted" fontSize="sm" overflowWrap="anywhere">
                            {managerNames ? `Managed by ${managerNames}` : "No managers assigned"}
                        </Text>
                    </Stack>
                    <Icon as={LuChevronRight} color="fg.muted" flexShrink={0} mt={0.5} />
                </HStack>
            </button>
        </Panel>
    );
};

export default VenueCard;
