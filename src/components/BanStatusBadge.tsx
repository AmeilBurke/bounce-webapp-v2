import { Badge } from "@chakra-ui/react";

type BanStatusBadgeProps = {
    isActive: boolean;
};

const BanStatusBadge = ({ isActive }: BanStatusBadgeProps) => {
    return (
        <Badge colorPalette={isActive ? "red" : "gray"}>
            {isActive ? "Active" : "Inactive"}
        </Badge>
    );
};

export default BanStatusBadge;
