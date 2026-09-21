import { Button } from "@chakra-ui/react";
import { TfiPlus } from "react-icons/tfi";

type CreateButtonProps = {
    text: string;
    onClick: () => void;
}

// need to figure out why this wont navigate

const CreateButton = ({ text, onClick }: CreateButtonProps) => {
    return (
        <Button onClick={onClick} variant={'subtle'} colorPalette={'orange'} >{text} <TfiPlus /></Button>
    )
}

export default CreateButton