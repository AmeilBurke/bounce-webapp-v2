import { Button } from "@chakra-ui/react";
import { TfiPlus } from "react-icons/tfi";

type CreateButtonProps = {
    text: string;
    onClick: () => void;
    isLoading?: boolean;
}

const CreateButton = ({ text, onClick, isLoading }: CreateButtonProps) => {
    return (
        <Button onClick={onClick} variant={'subtle'} colorPalette={'orange'} loading={isLoading} >{text} <TfiPlus /></Button>
    )
}

export default CreateButton