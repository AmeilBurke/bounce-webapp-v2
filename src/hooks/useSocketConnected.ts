import { useSyncExternalStore } from "react";
import { socket } from "@/socket";

const subscribe = (onChange: () => void) => {
    socket.on("connect", onChange);
    socket.on("disconnect", onChange);
    return () => {
        socket.off("connect", onChange);
        socket.off("disconnect", onChange);
    };
};

// Whether live updates are arriving, so the page can say when it might be out of date
const useSocketConnected = () => useSyncExternalStore(subscribe, () => socket.connected);

export default useSocketConnected;
