import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

type TabHeaderProps = {
    title: string;
    description: string;
    // Shown on the right, such as a status pill or the tab's main buttons
    aside?: ReactNode;
};

const TabHeader = ({ title, description, aside }: TabHeaderProps) => {
    return (
        <HStack w="full" justify="space-between" align="flex-start" gap={4} wrap="wrap">
            <Box>
                <Heading size="2xl" letterSpacing="-0.02em">
                    {title}
                </Heading>
                <Text color="fg.muted" fontSize="sm" mt={1}>
                    {description}
                </Text>
            </Box>
            {aside && (
                <HStack gap={2} wrap="wrap">
                    {aside}
                </HStack>
            )}
        </HStack>
    );
};

export default TabHeader;
