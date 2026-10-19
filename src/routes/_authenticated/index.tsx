import { createFileRoute } from "@tanstack/react-router";
import { Tabs } from "@chakra-ui/react";
import { TfiAlert } from "react-icons/tfi";
import { TfiSettings } from "react-icons/tfi";
import { TfiHome } from "react-icons/tfi";
import { TfiNa } from "react-icons/tfi";
import PageHeading from "@/components/PageHeading";
import { useQuery } from "@tanstack/react-query";
import { userDetailsQueryOptions } from "@/api-requests/auth/user.queries";
import Stacker from "@/components/Stacker";
import AlertTab from "@/components/tabs/AlertTab";
import SettingsTab from "@/components/tabs/SettingsTab";
import VenuesTab from "@/components/tabs/VenuesTab";
import BlanketBansTab from "@/components/tabs/BlanketBansTab";
import PageContainer from "@/components/PageContainer";

const TAB_LABELS = {
    alerts: "alerts",
    venues: "venues",
    "blanket-bans": "blanket bans",
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
    const { tab: activeTab = "alerts" } = Route.useSearch();
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
                >
                    <Tabs.List>
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
                    <Tabs.Content value="settings">
                        <SettingsTab />
                    </Tabs.Content>
                </Tabs.Root>
            </Stacker>
        </PageContainer>
    );
}
