import { Box, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { LuTrash2 } from "react-icons/lu";
import Panel from "./Panel";
import { SkeletonImage } from "./Skeletons";
import { formatBanDate } from "@/utils/bans";

type AlertCardProps = {
    imagePath: string;
    reason: string;
    startDate: string;
    isAdmin: boolean;
    onOpen: () => void;
};

const AlertCard = ({ imagePath, reason, startDate, isAdmin, onOpen }: AlertCardProps) => {
    return (
        <Panel h="full" overflow="hidden" display="flex" flexDirection="column">
            <Box borderBottomWidth="1px">
                <SkeletonImage aspectRatio={1} src={imagePath} alt={reason} objectFit="cover" />
            </Box>
            <Stack flex={1} gap={2} p={3}>
                <Text fontSize="sm" fontWeight="medium" overflowWrap="anywhere">
                    {reason}
                </Text>
                <HStack mt="auto" justify="space-between" gap={2}>
                    <Text color="fg.muted" fontSize="xs">
                        Issued {formatBanDate(startDate)}
                    </Text>
                    {isAdmin && (
                        <IconButton
                            onClick={onOpen}
                            aria-label="Delete alert"
                            size="xs"
                            variant="ghost"
                            colorPalette="red"
                        >
                            <LuTrash2 />
                        </IconButton>
                    )}
                </HStack>
            </Stack>
        </Panel>
    );
};

export default AlertCard;
