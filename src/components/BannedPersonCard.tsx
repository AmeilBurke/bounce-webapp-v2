import { Box, HStack, Text } from "@chakra-ui/react";
import Panel from "./Panel";
import { SkeletonImage } from "./Skeletons";
import BanStatusBadge from "./BanStatusBadge";

type BannedPersonCardProps = {
    name: string;
    imagePath: string;
    isActive: boolean;
    onOpen: () => void;
};

const BannedPersonCard = ({ name, imagePath, isActive, onOpen }: BannedPersonCardProps) => {
    return (
        <Panel asChild isClickable h="full" overflow="hidden" textAlign="start" display="flex" flexDirection="column">
            <button type="button" onClick={onOpen} aria-label={`Ban history for ${name}`}>
                <Box borderBottomWidth="1px" w="full">
                    <SkeletonImage aspectRatio={1} src={imagePath} alt={name} objectFit="cover" />
                </Box>
                <HStack flex={1} w="full" p={3} justify="space-between" align="flex-start" gap={2}>
                    <Text fontWeight="semibold" fontSize="sm" overflowWrap="anywhere">
                        {name}
                    </Text>
                    <BanStatusBadge isActive={isActive} />
                </HStack>
            </button>
        </Panel>
    );
};

export default BannedPersonCard;
