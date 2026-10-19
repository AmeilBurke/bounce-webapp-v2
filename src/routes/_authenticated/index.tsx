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

const TAB_LABELS = {
    alerts: "alerts",
    venues: "venues",
    "blanket-bans": "blanket bans",
    "pending-bans": "pending bans",
    settings: "settings",
} as const;

type Tab = keyof typeof TAB_LABELS;

const isTab = (value: unknown): value is Tab =>
    typeof value === "string" && value in TAB_LABELS;

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
    // throw new Error("Test error");

    return (
        <PageContainer>
            <Stacker direction={"column"}>
                <PageHeading
                    heading={`Dashboard - ${TAB_LABELS[activeTab]}`}
                    subheading={`Welcome ${user?.name}`}
                />
                <Tabs.Root
                    value={activeTab}
                    onValueChange={(e) => {
                        if (isTab(e.value)) navigate({ search: { tab: e.value }, replace: true });
                    }}
                    variant="enclosed"
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
                        rounded={{ base: 0, md: "l3" }}
                        bg={{ base: "bg", md: "bg.muted" }}
                        borderTopWidth={{ base: "1px", md: 0 }}
                        pb={{ base: "calc(0.25rem + env(safe-area-inset-bottom))", md: 1 }}
                        css={{
                            "& [role=tab]": {
                                flexDirection: { base: "column", md: "row" },
                                gap: { base: 0.5, md: 2 },
                                height: { base: "auto", md: undefined },
                                py: { base: 1.5, md: undefined },
                                fontSize: { base: "2xs", md: "sm" },
                                whiteSpace: "nowrap",
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
