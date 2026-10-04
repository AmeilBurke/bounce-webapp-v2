import { useEffect } from "react";
import {
    createFileRoute,
    Outlet,
    redirect,
    useNavigate,
} from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { userDetailsQueryOptions } from "@/api-requests/auth/user.queries";
import { socket } from "@/socket";

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
            queryClient.invalidateQueries({ queryKey: ["alerts"] });
        };

        const onStaffChange = () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        };

        const onConnectError = (err: Error) => {
            if (err.message === "unauthorized") {
                localStorage.removeItem("jwt");
                navigate({ to: "/sign-in" });
            }
        };

        socket.on("alert", onAlertChange);
        socket.on("staff", onStaffChange);
        socket.on("connect_error", onConnectError);
        socket.connect();

        return () => {
            socket.off("alert_created", onAlertChange);
            socket.off("alert_deleted", onStaffChange);
            socket.off("connect_error", onConnectError);
            socket.disconnect();
        };
    }, [queryClient, navigate]);

    return <Outlet />;
}
