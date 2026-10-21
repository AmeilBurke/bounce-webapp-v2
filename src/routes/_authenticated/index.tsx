import { createFileRoute } from "@tanstack/react-router";
import { Tabs } from "@chakra-ui/react";
import { TfiAlert } from "react-icons/tfi";
import { TfiSettings } from "react-icons/tfi";
import { TfiHome } from "react-icons/tfi";
import { TfiNa } from "react-icons/tfi";
import { TfiTime } from "react-icons/tfi";
import PageHeading from "@/components/PageHeading";
import { useQuery } from "@tanstack/react-query";
import { userDetailsQueryOptions } from "@/api-requests/auth/user.queries";
import Stacker from "@/components/Stacker";
import AlertTab from "@/components/tabs/AlertTab";
import SettingsTab from "@/components/tabs/SettingsTab";
import VenuesTab from "@/components/tabs/VenuesTab";
import BlanketBansTab from "@/components/tabs/BlanketBansTab";
import PendingBansTab from "@/components/tabs/PendingBansTab";
import PageContainer from "@/components/PageContainer";
import { Role } from "@/types/Role";
import StatusPill from "@/components/StatusPill";
import useSocketConnected from "@/hooks/useSocketConnected";

const TABS = ["alerts", "venues", "blanket-bans", "pending-bans", "settings"] as const;

type Tab = (typeof TABS)[number];

const isTab = (value: unknown): value is Tab =>
    typeof value === "string" && (TABS as readonly string[]).includes(value);

// The open tab lives in the URL so returning to the dashboard lands back on it
export const Route = createFileRoute("/_authenticated/")({
    validateSearch: (search: Record<string, unknown>): { tab?: Tab } => ({
        tab: isTab(search.tab) ? search.tab : undefined,
    }),
    component: Index,
});

function Index() {
    const { data: user } = useQuery(userDetailsQueryOptions);
    const navigate = Route.useNavigate();
    const { tab } = Route.useSearch();
    const isAdmin = user?.role === Role.ADMIN;
    // Pending bans are admin only, so anyone else linked there lands on alerts
    const activeTab: Tab =
        tab === undefined || (tab === "pending-bans" && !isAdmin) ? "alerts" : tab;
    const isLive = useSocketConnected();
    // throw new Error("Test error");

    return (
        <PageContainer>
            <Stacker direction={"column"}>
                <PageHeading
                    accent="Bounce"
                    heading="Dashboard"
                    subheading={user ? `Welcome back, ${user.name}` : undefined}
                    aside={
                        <StatusPill colorPalette={isLive ? "green" : "red"} isPulsing={isLive}>
                            {isLive ? "Live" : "Offline"}
                        </StatusPill>
                    }
                />
                <Tabs.Root
                    // Each tab only loads its data once it's first opened
                    lazyMount
                    value={activeTab}
                    onValueChange={(e) => {
                        if (isTab(e.value)) navigate({ search: { tab: e.value }, replace: true });
                    }}
                    variant="plain"
                    fitted
                    // Stacker aligns to flex-start, so without this the tabs shrink to each tab's content
                    w="full"
                    // Leaves room so the last of the content isn't hidden behind the bottom bar
                    pb={{ base: "calc(4.5rem + env(safe-area-inset-bottom))", md: 0 }}
                >
                    {/* On phones the tabs become a bottom navigation bar, like a native app */}
                    <Tabs.List
                        position={{ base: "fixed", md: "static" }}
                        bottom={0}
                        insetX={0}
                        zIndex="sticky"
                        rounded={{ base: 0, md: "xl" }}
                        bg="bg.panel"
                        borderWidth={{ base: 0, md: "1px" }}
                        borderTopWidth="1px"
                        p={{ base: 0, md: 1 }}
                        pb={{ base: "calc(0.25rem + env(safe-area-inset-bottom))", md: 1 }}
                        mb={{ base: 0, md: 4 }}
                        css={{
                            "& [role=tab]": {
                                flexDirection: { base: "column", md: "row" },
                                gap: { base: 0.5, md: 2 },
                                height: { base: "auto", md: undefined },
                                py: { base: 1.5, md: undefined },
                                fontSize: { base: "2xs", md: "sm" },
                                fontWeight: "medium",
                                color: "fg.muted",
                                rounded: "lg",
                                whiteSpace: "nowrap",
                            },
                            "& [role=tab][data-selected]": {
                                color: { base: "accent", md: "fg" },
                                bg: { base: "transparent", md: "bg.muted" },
                            },
                            // Stops long labels squashing the icon to nothing
                            "& [role=tab] svg": { boxSize: { base: 5, md: 4 }, flexShrink: 0 },
                        }}
                    >
                        <Tabs.Trigger value="alerts">
                            <TfiAlert />
                            Alerts
                        </Tabs.Trigger>
                        <Tabs.Trigger value="venues">
                            <TfiHome />
                            Venues
                        </Tabs.Trigger>
                        <Tabs.Trigger value="blanket-bans">
                            <TfiNa />
                            Blanket Bans
                        </Tabs.Trigger>
                        {isAdmin && (
                            <Tabs.Trigger value="pending-bans">
                                <TfiTime />
                                Pending Bans
                            </Tabs.Trigger>
                        )}
                        <Tabs.Trigger value="settings">
                            <TfiSettings />
                            Settings
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="alerts">
                        <AlertTab />
                    </Tabs.Content>
                    <Tabs.Content value="venues">
                        <VenuesTab />
                    </Tabs.Content>
                    <Tabs.Content value="blanket-bans">
                        <BlanketBansTab />
                    </Tabs.Content>
                    {isAdmin && (
                        <Tabs.Content value="pending-bans">
                            <PendingBansTab />
                        </Tabs.Content>
                    )}
                    <Tabs.Content value="settings">
                        <SettingsTab />
                    </Tabs.Content>
                </Tabs.Root>
            </Stacker>
        </PageContainer>
    );
}
