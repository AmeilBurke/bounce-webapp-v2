import Stacker from "./Stacker";
import { Text } from "@chakra-ui/react";
import { SkeletonImage } from "./Skeletons";
import BanStatusBadge from "./BanStatusBadge";

type BannedPersonCardProps = {
    name: string;
    imagePath: string;
    isActive: boolean;
    onOpen: () => void;
};

const BannedPersonCard = ({ name, imagePath, isActive, onOpen }: BannedPersonCardProps) => {
    return (
        <Stacker direction="column" gap={2}>
            <SkeletonImage
                aspectRatio={1}
                src={imagePath}
                alt={name}
                objectFit="cover"
                cursor="pointer"
                onClick={onOpen}
            />
            <Text fontWeight="medium">{name}</Text>
            <BanStatusBadge isActive={isActive} />
        </Stacker>
    );
};

export default BannedPersonCard;
