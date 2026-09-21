import Stacker from "./Stacker";
import {
    HStack,
    IconButton,
    Image,
    Text,
} from "@chakra-ui/react";
import { LuTrash2 } from "react-icons/lu";

type AlertCardProps = {
    imagePath: string;
    reason: string;
    isAdmin: boolean;
    onOpen: () => void;
};

const AlertCard = ({ imagePath, reason, isAdmin, onOpen }: AlertCardProps) => {
    return (
        <Stacker direction="column" gap={2} >
            <Image aspectRatio={1} src={imagePath} objectFit="cover" />
            <HStack w="full" justify="space-between">
                <Text>{reason}</Text>

                {isAdmin && (
                    <IconButton onClick={onOpen} aria-label="Delete alert" size="sm" variant="ghost">
                        <LuTrash2 />
                    </IconButton>
                )}
            </HStack>
        </Stacker>
    );
};

export default AlertCard;