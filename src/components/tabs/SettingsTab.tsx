import { useNavigate } from "@tanstack/react-router";
import CreateButton from "../CreateButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Stacker from "../Stacker";
import { staffQueryOptions } from "@/api-requests/staff/staff.queries";
import { Heading, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Role } from "@/types/Role";
import Dialog from "../Dialog";
import type { Staff } from "@/types/Staff";
import { userDetailsQueryOptions } from "@/api-requests/auth/user.queries";
import DialogBodyEdit from "../settings-tab/DialogBodyEdit";
import DialogBodyView from "../settings-tab/DialogBodyView";

const ROLE_ORDER: Role[] = [Role.ADMIN, Role.VENUE_MANAGER, Role.DUTY_MANAGER, Role.BOUNCER];
const ROLE_LABELS: Record<Role, string> = {
    [Role.ADMIN]: "Admins",
    [Role.VENUE_MANAGER]: "Venue Managers",
    [Role.DUTY_MANAGER]: "Duty Managers",
    [Role.BOUNCER]: "Bouncers",
};

const SettingsTab = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: staff, isPending, isError } = useQuery(staffQueryOptions);
    const { data: user } = useQuery(userDetailsQueryOptions);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const staffByRole = useMemo(
        () => (staff ? Object.groupBy(staff, (s) => s.role) : {}),
        [staff],
    );

    const [chosenStaff, setChosenStaff] = useState<Staff | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const openDialog = (s: Staff) => {
        setChosenStaff(s);
        setIsDialogOpen(true);
    };

    const closeDialog = () => setIsDialogOpen(false);

    const onSignOut = () => {
        setIsSubmitting(true);
        localStorage.removeItem("jwt");
        queryClient.clear();
        navigate({ to: "/sign-in" });
    };

    const onCreateNewAccount = () => {
        navigate({ to: "/create-account" });
    };

    const renderStaff = () => {
        if (isPending) {
            return <Text>Loading staff...</Text>;
        }

        if (isError) {
            return <Text>Couldn't load staff</Text>;
        }

        if (staff.length === 0) {
            return <Text>No staff accounts found</Text>;
        }

        return (
            <Stacker direction={"column"}>
                {ROLE_ORDER.map((role) => {
                    const members = staffByRole[role];
                    if (!members?.length) return null;

                    return (
                        <Stacker direction={"column"} key={role} gap="2">
                            <Heading as="h3" size="md">
                                {ROLE_LABELS[role]}
                            </Heading>

                            <Stacker direction={"column"} gap="1">
                                {members.map((s) => (
                                    <Text
                                        onClick={() => openDialog(s)}
                                        key={s.id}
                                        color="fg.muted"
                                        cursor="pointer"
                                    >
                                        {s.name}
                                    </Text>
                                ))}
                            </Stacker>
                        </Stacker>
                    );
                })}
            </Stacker>
        );
    };

    return (
        <Stacker direction="column">
            {
                user?.role === Role.ADMIN && (
                    <CreateButton
                        text="Create New Account"
                        onClick={onCreateNewAccount}
                        isLoading={isSubmitting}
                    />
                )
            }
            <CreateButton
                text="Sign out"
                onClick={onSignOut}
                isLoading={isSubmitting}
            />

            {renderStaff()}

            <Dialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                onExitComplete={() => setChosenStaff(undefined)}
                title={`Account Details For ${chosenStaff?.name ?? ""}`}
                body={
                    user?.role === Role.ADMIN || user?.id === chosenStaff?.id ? (
                        <DialogBodyEdit
                            key={chosenStaff?.id}
                            chosenStaff={chosenStaff}
                            closeDialog={closeDialog}
                        />
                    ) : (
                        <DialogBodyView chosenStaff={chosenStaff} />
                    )
                }
            />
        </Stacker>
    );
};

export default SettingsTab;
