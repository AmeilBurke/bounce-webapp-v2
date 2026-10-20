import Stacker from "./Stacker";
import {
    HStack,
    IconButton,
} from "@chakra-ui/react";
import ClampedText from "./ClampedText";
import { SkeletonImage } from "./Skeletons";
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
            <SkeletonImage aspectRatio={1} src={imagePath} alt={reason} objectFit="cover" />
            <HStack w="full" justify="space-between" align="flex-start">
                <ClampedText lines={3}>{reason}</ClampedText>

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