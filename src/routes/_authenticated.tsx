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

        const onAlertCreated = () => {
            toast("Alert uploaded");
            queryClient.invalidateQueries({ queryKey: ["alerts"] });
        };

        const onAlertDeleted = () => {
            queryClient.invalidateQueries({ queryKey: ["alerts"] });
        };

        const onConnectError = (err: Error) => {
            if (err.message === "unauthorized") {
                localStorage.removeItem("jwt");
                navigate({ to: "/sign-in" });
            }
        };

        socket.on("alert_created", onAlertCreated);
        socket.on("alert_deleted", onAlertDeleted);
        socket.on("connect_error", onConnectError);
        socket.connect();

        return () => {
            socket.off("alert_created", onAlertCreated);
            socket.off("alert_deleted", onAlertDeleted);
            socket.off("connect_error", onConnectError);
            socket.disconnect();
        };
    }, [queryClient, navigate]);

    return <Outlet />;
}
