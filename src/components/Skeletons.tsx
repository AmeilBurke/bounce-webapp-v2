import { Card, SimpleGrid, Skeleton, SkeletonText, type SimpleGridProps } from "@chakra-ui/react";
import type { ReactNode } from "react";
import Stacker from "./Stacker";

type CardGridSkeletonProps = {
    columns?: SimpleGridProps["columns"];
    count?: number;
    // Rendered once per placeholder card
    card: ReactNode;
};

export const CardGridSkeleton = ({ columns = [2, null, null, 4], count = 8, card }: CardGridSkeletonProps) => {
    return (
        <SimpleGrid columns={columns} columnGap={4} rowGap={8} w="full">
            {Array.from({ length: count }, (_, i) => (
                <Stacker key={i} direction="column" gap={2}>
                    {card}
                </Stacker>
            ))}
        </SimpleGrid>
    );
};

// Matches cards that show a square image with text underneath
export const ImageCardSkeleton = ({ lines = 1 }: { lines?: number }) => {
    return (
        <>
            <Skeleton aspectRatio={1} w="full" />
            <SkeletonText noOfLines={lines} />
        </>
    );
};

export const VenueCardSkeleton = () => {
    return (
        <Card.Root w="full">
            <Card.Body>
                <SkeletonText noOfLines={2} />
            </Card.Body>
        </Card.Root>
    );
};

export const StaffListSkeleton = () => {
    return (
        <Stacker direction="column">
            {Array.from({ length: 2 }, (_, i) => (
                <Stacker key={i} direction="column" gap="2">
                    <Skeleton h="6" w="40" />
                    <SkeletonText noOfLines={3} maxW="xs" />
                </Stacker>
            ))}
        </Stacker>
    );
};
