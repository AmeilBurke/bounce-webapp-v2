import Stacker from "./Stacker";
import { Image, Text } from "@chakra-ui/react";
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
            <Image
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
