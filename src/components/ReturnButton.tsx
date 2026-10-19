import { Button } from "@chakra-ui/react"
import { useCanGoBack, useNavigate, useRouter } from "@tanstack/react-router"
import { LuChevronLeft } from "react-icons/lu"

const ReturnButton = () => {

    const navigate = useNavigate();
    const router = useRouter();
    const canGoBack = useCanGoBack();

    // Go back like a native app, falling back to the dashboard when the page was opened directly
    const onReturn = () => {
        if (canGoBack) {
            router.history.back();
        } else {
            navigate({ to: "/" });
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            ps={1}
            ms={-1}
            gap={0.5}
            color="fg.muted"
            onClick={onReturn}
            aria-label="Go back"
        >
            <LuChevronLeft />
            Back
        </Button>
    )
}

export default ReturnButton
