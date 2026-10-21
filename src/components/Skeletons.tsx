import {
    Box,
    Field,
    HStack,
    Image,
    SimpleGrid,
    Skeleton,
    SkeletonText,
    type ImageProps,
    type SimpleGridProps,
} from "@chakra-ui/react";
import { useState, type ReactNode } from "react";
import Panel from "./Panel";
import Stacker from "./Stacker";

// Shared by every grid of photo cards, so alerts and banned people line up the same way
export const CARD_GRID_COLUMNS = [2, null, 3, 4];

type CardGridSkeletonProps = {
    columns?: SimpleGridProps["columns"];
    count?: number;
    // Rendered once per placeholder card
    card: ReactNode;
};

export const CardGridSkeleton = ({ columns = CARD_GRID_COLUMNS, count = 8, card }: CardGridSkeletonProps) => {
    return (
        <SimpleGrid columns={columns} gap={3} w="full">
            {Array.from({ length: count }, (_, i) => (
                <Box key={i}>{card}</Box>
            ))}
        </SimpleGrid>
    );
};

// Matches cards that show a square image with text underneath
export const ImageCardSkeleton = ({ lines = 1 }: { lines?: number }) => {
    return (
        <Panel overflow="hidden">
            <Skeleton aspectRatio={1} w="full" rounded="none" />
            <Box p={3}>
                <SkeletonText noOfLines={lines} />
            </Box>
        </Panel>
    );
};

export const VenueCardSkeleton = () => {
    return (
        <Panel p={4}>
            <SkeletonText noOfLines={2} />
        </Panel>
    );
};

export const StaffListSkeleton = () => {
    return (
        <Stacker direction="column" gap={6}>
            {Array.from({ length: 2 }, (_, i) => (
                <Stacker key={i} direction="column" gap={3}>
                    <Skeleton h="3" w="24" />
                    <Panel w="full">
                        {Array.from({ length: 3 }, (_, row) => (
                            <Box key={row} p={4} borderTopWidth={row > 0 ? "1px" : 0}>
                                <SkeletonText noOfLines={2} maxW="xs" />
                            </Box>
                        ))}
                    </Panel>
                </Stacker>
            ))}
        </Stacker>
    );
};

// Matches PendingBanCard's photo, details, timeline and action bar
export const PendingBanCardSkeleton = () => {
    return (
        <Panel w="full" overflow="hidden">
            <HStack align="stretch" gap={0}>
                <Skeleton w={["28", null, "36"]} aspectRatio={3 / 4} flexShrink={0} rounded="none" />
                <Stacker direction="column" gap={3} padding={4}>
                    <SkeletonText noOfLines={2} />
                    <SkeletonText noOfLines={2} />
                    <Skeleton h="5" w="24" rounded="full" />
                </Stacker>
            </HStack>
            <Box px={4} py={3} borderTopWidth="1px">
                <Skeleton h="9" w="full" />
            </Box>
            <HStack px={4} py={3} borderTopWidth="1px" bg="bg.subtle" justify="flex-end" gap={2}>
                <Skeleton h="8" w="24" rounded="lg" />
                <Skeleton h="8" w="24" rounded="lg" />
            </HStack>
        </Panel>
    );
};

// Stands in for a select whose options are still loading
export const FieldSkeleton = ({ label, isRequired }: { label: string; isRequired?: boolean }) => {
    return (
        <Field.Root w="full" required={isRequired}>
            <Field.Label>
                {label} <Field.RequiredIndicator />
            </Field.Label>
            <Skeleton h="10" w="full" rounded="l2" />
        </Field.Root>
    );
};

// Pulses until the image has downloaded, and again whenever src changes
export const SkeletonImage = (props: ImageProps & { src: string }) => {
    const [loadedSrc, setLoadedSrc] = useState<string | undefined>(undefined);

    return (
        <Skeleton loading={loadedSrc !== props.src} w="full" rounded="none">
            <Image
                {...props}
                w="full"
                loading="lazy"
                onLoad={() => setLoadedSrc(props.src)}
                // A broken image shouldn't pulse forever
                onError={() => setLoadedSrc(props.src)}
            />
        </Skeleton>
    );
};
