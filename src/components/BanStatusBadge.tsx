import StatusPill from "./StatusPill";

type BanStatusBadgeProps = {
    isActive: boolean;
};

const BanStatusBadge = ({ isActive }: BanStatusBadgeProps) => {
    return (
        <StatusPill colorPalette={isActive ? "red" : "gray"} size="sm">
            {isActive ? "Active" : "Inactive"}
        </StatusPill>
    );
};

export default BanStatusBadge;
