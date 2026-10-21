import { EmptyState } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { LuInbox, LuSearchX, LuTriangleAlert } from "react-icons/lu";

type EmptyMessageProps = {
    // empty: nothing exists yet, search: nothing matches, error: it couldn't load
    kind?: "empty" | "search" | "error";
    title: string;
    description?: string;
    // Replaces the icon the kind would show
    icon?: ReactNode;
    colorPalette?: string;
};

const ICONS = {
    empty: <LuInbox />,
    search: <LuSearchX />,
    error: <LuTriangleAlert />,
};

// Stands in for a list that has nothing to show
const EmptyMessage = ({ kind = "empty", title, description, icon, colorPalette }: EmptyMessageProps) => {
    const palette = colorPalette ?? (kind === "error" ? "red" : "gray");

    return (
        <EmptyState.Root w="full" bg="bg.panel" borderWidth="1px" rounded="xl" size="sm" py={8}>
            <EmptyState.Content>
                <EmptyState.Indicator color={palette === "gray" ? "fg.muted" : `${palette}.fg`}>
                    {icon ?? ICONS[kind]}
                </EmptyState.Indicator>
                <EmptyState.Title>{title}</EmptyState.Title>
                {description && <EmptyState.Description>{description}</EmptyState.Description>}
            </EmptyState.Content>
        </EmptyState.Root>
    );
};

export default EmptyMessage;
