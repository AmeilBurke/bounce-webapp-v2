import { Button } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";

type CreateButtonProps = {
    text: string;
    onClick: () => void;
    isLoading?: boolean;
}

const CreateButton = ({ text, onClick, isLoading }: CreateButtonProps) => {
    return (
        <Button onClick={onClick} size="sm" loading={isLoading}>
            <LuPlus /> {text}
        </Button>
    )
}

export default CreateButton
