import { Box, HStack } from "@chakra-ui/react";
import type { ReactNode } from "react";

type StatusPillProps = {
    colorPalette: string;
    children: ReactNode;
    // Pulses the dot, for something live or waiting on someone
    isPulsing?: boolean;
    // sm fits inside cards, md sits beside headings
    size?: "sm" | "md";
};

const StatusPill = ({ colorPalette, children, isPulsing, size = "md" }: StatusPillProps) => {
    return (
        <HStack
            colorPalette={colorPalette}
            display="inline-flex"
            gap={size === "sm" ? 1.5 : 2}
            px={size === "sm" ? 2 : 3}
            py={size === "sm" ? 0.5 : 1}
            rounded="full"
            borderWidth="1px"
            bg="bg.panel"
            fontSize={size === "sm" ? "xs" : "sm"}
            fontWeight="semibold"
            whiteSpace="nowrap"
            flexShrink={0}
        >
            <Box
                boxSize={size === "sm" ? "2" : "2.5"}
                rounded="full"
                bg="colorPalette.solid"
                boxShadow={
                    isPulsing
                        ? "0 0 0 4px color-mix(in srgb, var(--chakra-colors-color-palette-solid) 25%, transparent)"
                        : undefined
                }
                animation={isPulsing ? "status-pulse 2s infinite" : undefined}
            />
            {children}
        </HStack>
    );
};

export default StatusPill;
