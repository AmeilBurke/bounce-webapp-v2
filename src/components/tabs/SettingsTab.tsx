import { useNavigate } from "@tanstack/react-router"
import CreateButton from "../CreateButton"
import { useQueryClient } from "@tanstack/react-query";


const SettingsTab = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const onSignOut = () => {
        localStorage.removeItem("jwt");
        queryClient.clear();
        navigate({ to: "/sign-in" });
    }

    return (
        <CreateButton
            text="Sign out"
            onClick={onSignOut}
        />
    )
}

export default SettingsTab