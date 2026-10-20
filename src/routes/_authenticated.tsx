import { useEffect } from "react";
import {
    createFileRoute,
    Outlet,
    redirect,
    useNavigate,
} from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { refresh } from "@/utils/queries";
import { userDetailsQueryOptions } from "@/api-requests/auth/user.queries";
import { socket } from "@/socket";
import toast from "react-hot-toast";

export const Route = createFileRoute("/_authenticated")({
    beforeLoad: async ({ context }) => {
        if (!localStorage.getItem("jwt")) {
            throw redirect({ to: "/sign-in" });
        }

        try {
            await context.queryClient.query(userDetailsQueryOptions);
        } catch {
            localStorage.removeItem("jwt");
            throw redirect({ to: "/sign-in" });
        }
    },
    component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    useEffect(() => {
        // console.log("socket url:", import.meta.env.VITE_API_URL);

        const onAlertChange = () => {
            refresh(queryClient, ["alerts"]);
        };

        const onStaffChange = () => {
            refresh(queryClient, ["staff"]);
        };

        const onVenueChange = () => {
            refresh(queryClient, ["venues"]);
        };

        // Banned people are returned with their bans, and pending bans with their person,
        // so a change to either refreshes both
        const onBannedPeopleChange = () => {
            refresh(queryClient, ["banned-people"]);
            refresh(queryClient, ["bans"]);
        };

        const onStaffDelete = () => {
            toast.error("Your account has been deleted");
            localStorage.removeItem("jwt");
            navigate({ to: "/sign-in" });
        }

        const onConnectError = (err: Error) => {
            if (err.message === "unauthorized") {
                localStorage.removeItem("jwt");
                navigate({ to: "/sign-in" });
            }
        };

        socket.on("alert", onAlertChange);
        socket.on("staff", onStaffChange);
        socket.on("venue", onVenueChange);
        socket.on("ban", onBannedPeopleChange);
        socket.on("bannedPerson", onBannedPeopleChange);
        socket.on("delete", onStaffDelete);
        socket.on("connect_error", onConnectError);
        socket.connect();

        return () => {
            socket.off("alert", onAlertChange);
            socket.off("staff", onStaffChange);
            socket.off("venue", onVenueChange);
            socket.off("ban", onBannedPeopleChange);
            socket.off("bannedPerson", onBannedPeopleChange);
            socket.off("delete", onStaffDelete);
            socket.off("connect_error", onConnectError);
            socket.disconnect();
        };
    }, [queryClient, navigate]);

    return <Outlet />;
}
