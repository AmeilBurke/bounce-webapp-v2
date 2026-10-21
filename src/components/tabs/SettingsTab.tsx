import { useNavigate } from "@tanstack/react-router";
import CreateButton from "../CreateButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Stacker from "../Stacker";
import { staffQueryOptions } from "@/api-requests/staff/staff.queries";
import { Box, Button, HStack, Icon, Text } from "@chakra-ui/react";
import { LuChevronRight, LuLogOut } from "react-icons/lu";
import EmptyMessage from "../EmptyMessage";
import Panel from "../Panel";
import SectionLabel from "../SectionLabel";
import StatusPill from "../StatusPill";
import TabHeader from "../TabHeader";
import { useMemo, useState } from "react";
import { Role } from "@/types/Role";
import Dialog from "../Dialog";
import { StaffListSkeleton } from "../Skeletons";
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
            return <StaffListSkeleton />;
        }

        if (isError) {
            return <EmptyMessage kind="error" title="Couldn't load staff" />;
        }

        if (staff.length === 0) {
            return <EmptyMessage title="No staff accounts found" />;
        }

        return (
            <Stacker direction={"column"} gap={6}>
                {ROLE_ORDER.map((role) => {
                    const members = staffByRole[role];
                    if (!members?.length) return null;

                    return (
                        <Stacker direction={"column"} key={role} gap={3}>
                            <SectionLabel>
                                {ROLE_LABELS[role]} · {members.length}
                            </SectionLabel>

                            <Panel w="full" overflow="hidden">
                                {members.map((s, index) => (
                                    <HStack
                                        asChild
                                        key={s.id}
                                        w="full"
                                        px={4}
                                        py={3}
                                        gap={3}
                                        textAlign="start"
                                        borderTopWidth={index > 0 ? "1px" : 0}
                                        cursor="pointer"
                                        _hover={{ bg: "bg.subtle" }}
                                    >
                                        <button type="button" onClick={() => openDialog(s)}>
                                            <Box flex={1} minW={0}>
                                                <Text fontWeight="medium" overflowWrap="anywhere">
                                                    {s.name}
                                                </Text>
                                                <Text color="fg.muted" fontSize="sm" overflowWrap="anywhere">
                                                    {s.email}
                                                </Text>
                                            </Box>
                                            {s.id === user?.id && (
                                                <StatusPill colorPalette="purple" size="sm">
                                                    You
                                                </StatusPill>
                                            )}
                                            <Icon as={LuChevronRight} color="fg.muted" flexShrink={0} />
                                        </button>
                                    </HStack>
                                ))}
                            </Panel>
                        </Stacker>
                    );
                })}
            </Stacker>
        );
    };

    return (
        <Stacker direction="column">
            <TabHeader
                title="Settings"
                description="Staff accounts and your own details"
                aside={
                    <>
                        {user?.role === Role.ADMIN && (
                            <CreateButton
                                text="New Account"
                                onClick={onCreateNewAccount}
                                isLoading={isSubmitting}
                            />
                        )}
                        <Button size="sm" variant="outline" bg="bg.panel" onClick={onSignOut} loading={isSubmitting}>
                            <LuLogOut /> Sign out
                        </Button>
                    </>
                }
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
