import Stacker from "../Stacker";
import CreateButton from "../CreateButton";
import { useNavigate } from "@tanstack/react-router";
import { alertsQueryOptions } from "@/api-requests/alerts/alerts.queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { refresh } from "@/utils/queries";
import { Text, SimpleGrid, Button } from "@chakra-ui/react";
import AlertCard from "../AlertCard";
import { CARD_GRID_COLUMNS, CardGridSkeleton, ImageCardSkeleton } from "../Skeletons";
import EmptyMessage from "../EmptyMessage";
import SectionLabel from "../SectionLabel";
import TabHeader from "../TabHeader";
import { userDetailsQueryOptions } from "@/api-requests/auth/user.queries";
import { useState } from "react";
import Dialog from "../Dialog";
import type { Alert } from "@/types/Alert";
import deleteAlert from "@/api-requests/alerts/deleteAlert";
import toast from "react-hot-toast";
import { apiErrorMessage } from "@/utils/errors";
import { Role } from "@/types/Role";

const AlertTab = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: alerts, isPending, isError } = useQuery(alertsQueryOptions);
    const { data: user } = useQuery(userDetailsQueryOptions);
    const [alertIdToDelete, setAlertIdToDelete] = useState<Alert["id"] | undefined>(undefined);
    const isDialogOpen = alertIdToDelete !== undefined;
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const closeDialog = () => setAlertIdToDelete(undefined);

    const onAlertDelete = async () => {
        if (alertIdToDelete === undefined) return;

        try {
            setIsSubmitting(true);
            await deleteAlert(alertIdToDelete);

            await refresh(queryClient, ["alerts"]);
            toast.success("Alert Deleted");

            closeDialog();
        } catch (err) {
            toast.error(apiErrorMessage(err, "Couldn't delete alert"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderAlerts = () => {
        if (isPending) {
            return <CardGridSkeleton card={<ImageCardSkeleton lines={3} />} />;
        }

        if (isError) {
            return <EmptyMessage kind="error" title="Couldn't load alerts" />;
        }

        if (alerts.length === 0) {
            return (
                <EmptyMessage
                    title="No alerts"
                    description="Alerts you issue will show here for every venue"
                />
            );
        }

        return (
            <SimpleGrid columns={CARD_GRID_COLUMNS} gap={3} w="full">
                {alerts.map((alert) => (
                    <AlertCard
                        key={alert.id}
                        onOpen={() => setAlertIdToDelete(alert.id)}
                        imagePath={alert.imagePath}
                        reason={alert.reason}
                        startDate={alert.startDate}
                        isAdmin={user?.role === Role.ADMIN}
                    />
                ))}
            </SimpleGrid>
        );
    };

    return (
        <Stacker direction={"column"}>
            <TabHeader
                title="Alerts"
                description="People to look out for at every venue"
                aside={
                    <CreateButton
                        text="New Alert"
                        onClick={async () => await navigate({ to: "/create-alert" })}
                    />
                }
            />

            <Stacker direction={"column"} gap={3}>
                <SectionLabel>{alerts ? `${alerts.length} issued` : "Issued"}</SectionLabel>
                {renderAlerts()}
            </Stacker>

            <Dialog
                isOpen={isDialogOpen}
                setIsOpen={(open) => {
                    if (!open) closeDialog();
                }}
                title="Delete this alert?"
                body={
                    <Text>
                        This will permanently delete the alert. This action cannot be
                        undone.
                    </Text>
                }
                footer={
                    <>
                        <Button onClick={closeDialog} variant="outline" loading={isSubmitting}>
                            Cancel
                        </Button>
                        <Button onClick={onAlertDelete} colorPalette="red" loading={isSubmitting}>
                            Delete
                        </Button>
                    </>
                }
            />
        </Stacker>
    );
};

export default AlertTab;
