import { IconButton } from "@chakra-ui/react"
import { useNavigate } from "@tanstack/react-router"
import { TfiAngleLeft } from "react-icons/tfi"

const ReturnButton = () => {

    const navigate = useNavigate();

    return (
        <IconButton variant='ghost' onClick={() => navigate({ to: "/" })} ><TfiAngleLeft /></IconButton>
    )
}

export default ReturnButton