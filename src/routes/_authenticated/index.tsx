import { createFileRoute } from "@tanstack/react-router";
import { Tabs } from "@chakra-ui/react";
import { TfiAlert } from "react-icons/tfi";
import { TfiSettings } from "react-icons/tfi";
import { useState } from "react";
import PageHeading from "@/components/PageHeading";
import { useQuery } from "@tanstack/react-query";
import { userDetailsQueryOptions } from "@/api-requests/auth/user.queries";
import Stacker from "@/components/Stacker";
import AlertTab from "@/components/tabs/AlertTab";
import SettingsTab from "@/components/tabs/SettingsTab";
import PageContainer from "@/components/PageContainer";

export const Route = createFileRoute("/_authenticated/")({
    component: Index,
});

function Index() {
    const { data: user } = useQuery(userDetailsQueryOptions);

    const [activeTab, setActiveTab] = useState("alerts");

    return (
        <PageContainer>
            <Stacker direction={"column"}>
                <PageHeading
                    heading={`Dashboard - ${activeTab}`}
                    subheading={`Welcome ${user?.name}`}
                />
                <Tabs.Root
                    value={activeTab}
                    onValueChange={(e) => setActiveTab(e.value)}
                    defaultValue="alerts"
                    variant="enclosed"
                >
                    <Tabs.List>
                        <Tabs.Trigger value="alerts">
                            <TfiAlert />
                            Alerts
                        </Tabs.Trigger>
                        <Tabs.Trigger value="settings">
                            <TfiSettings />
                            Settings
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="alerts">
                        <AlertTab />
                    </Tabs.Content>
                    <Tabs.Content value="settings">
                        <SettingsTab />
                    </Tabs.Content>
                </Tabs.Root>
            </Stacker>
        </PageContainer>
    );
}
