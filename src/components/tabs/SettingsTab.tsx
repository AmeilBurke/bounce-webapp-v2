import { useNavigate } from "@tanstack/react-router";
import CreateButton from "../CreateButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Stacker from "../Stacker";
import { staffQueryOptions } from "@/api-requests/staff/staff.queries";
import { Button, Heading, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Role } from "@/types/Role";
import Dialog from "../Dialog";
import type { Staff } from "@/types/Staff";
import { userDetailsQueryOptions } from "@/api-requests/auth/user.queries";
import DialogBodyEdit from "../settings-tab/DialogBodyEdit";
import DialogBodyView from "../settings-tab/DialogBodyView";

const SettingsTab = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: staff, isPending, isError } = useQuery(staffQueryOptions);
    const { data: user } = useQuery(userDetailsQueryOptions);

    const staffByRole = useMemo(
        () => (staff ? Object.groupBy(staff, (s) => s.role) : {}),
        [staff],
    );

    const ROLE_ORDER: Role[] = [Role.ADMIN, Role.BOUNCER];
    const ROLE_LABELS: Record<Role, string> = {
        [Role.ADMIN]: "Admins",
        [Role.BOUNCER]: "Bouncers",
    };

    const [chosenStaff, setChosenStaff] = useState<Staff | undefined>(undefined);
    const isDialogOpen = chosenStaff !== undefined;

    const onSignOut = () => {
        localStorage.removeItem("jwt");
        queryClient.clear();
        navigate({ to: "/sign-in" });
    };

    const onCreateNewAccount = () => {
        navigate({ to: "/create-account" });
    };

    const renderStaff = () => {
        if (isPending) {
            return <Text>Loading alerts...</Text>;
        }

        if (isError) {
            return <Text>Couldn't load alerts</Text>;
        }

        if (staff.length === 0) {
            return <Text>No alerts have been issued</Text>;
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
                                    <Text onClick={() => setChosenStaff(s)} key={s.id} color="fg.muted">
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

    const closeDialog = () => setChosenStaff(undefined);

    const onAlertDelete = async () => {
        if (chosenStaff === undefined) return;

        // try {
        //     await deleteAlert(alertIdToDelete);

        //     await queryClient.invalidateQueries({ queryKey: ["alerts"] });

        //     closeDialog();
        // } catch (err) {
        //     toast.error(String(err));
        //     toast.error("Couldn't delete alert");
        // }
    };

    return (
        <Stacker direction="column">
            <CreateButton text="Create New Account" onClick={onCreateNewAccount} />
            <CreateButton text="Sign out" onClick={onSignOut} />

            {renderStaff()}

            <Dialog
                isOpen={isDialogOpen}
                setIsOpen={(open) => { if (!open) closeDialog() }}
                title={`Account Details For ${chosenStaff?.name}`}
                body={
                    user?.role === Role.ADMIN || user?.id === chosenStaff?.id
                        ? <DialogBodyEdit chosenStaff={chosenStaff} />
                        : <DialogBodyView chosenStaff={chosenStaff} />
                }
                footer={<></>}
            />
        </Stacker>
    );
};

export default SettingsTab;
